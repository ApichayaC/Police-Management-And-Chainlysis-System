import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { QueryResult, Result, Session } from 'neo4j-driver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { GraphInput } from 'src/types';

@Injectable()
export class GraphService {

    constructor(
        private readonly neo4j: Neo4jService,
        private readonly transactionService: TransactionService,
        private readonly prisma: PrismaService
    ) { }

    public async autoPut() {
        const snap = await this.prisma.putGrahpSnapshot.findFirst({ orderBy: { createdAt: 'desc' } });
        let pageSize = 5000;
        let page = snap ? Math.floor(snap.index / pageSize) : 0;
        let numTx = 0;
        do {
            try {
                console.log(`Put at: ${page * pageSize} to ${(page + 1) * pageSize}`);
                numTx = await this.putGraph(page * pageSize, (page + 1) * pageSize);
                page++;
                await this.prisma.putGrahpSnapshot.create({
                    data: {
                        index: (page + 1) * pageSize
                    }
                })
                console.log(`Put success: `, numTx, " transactions");
            } catch (e) {
                console.error("Error on auto put graph");
            }
        } while (numTx > 0);
        return true;
    }

    public async putGraph(limit: number, offset: number) {
        let transactions: Transaction[];
        let session: Session;
        let result: QueryResult;
        try {
            session = await this.neo4j.getWriteSession();
            transactions = await this.transactionService.getTransactions(limit, offset);
            result = await session.run(`
                UNWIND $transactions AS transaction
                MERGE (from:Wallet {address: transaction.from})
                MERGE (to:Wallet {address: transaction.to})
                MERGE (from)-[s:SEND {hash: transaction.hash, timeStamp: transaction.timeStamp}]->(to)
                RETURN from.address, to.address
            `, { transactions });
        } catch (e) {
            console.error(e)
        }
        session.close();
        return transactions.length;
    }

    public async getRelations(from: string, to: string, level: number) {
        let queryLevel = Math.max(1, level - 1);
        let arr = Array.from(Array(queryLevel));
        let matchQuery = arr.reduce((prev, cur, index) => {
            return prev + `-[s${index + 1}:SEND]->(a${index + 2})`
        }, '(a1)');
        let returnWalletQuery = arr.reduce((prev, cur, index) => {
            return prev + `,a${index + 2}`
        }, 'a1');
        let returnSentQuery = arr.reduce((prev, cur, index) => {
            return prev + `,s${index + 1}`
        }, '');
        const returnQuery = `${returnWalletQuery}${returnSentQuery}`;
        console.log(`
            MATCH ${matchQuery}
            WHERE a1.address='${from}' AND a${level}.address='${to}'
            RETURN ${returnQuery}
        `)
        const result = await this.neo4j.read(`
            MATCH ${matchQuery}
            WHERE a1.address=$from AND a${level}.address=$to
            RETURN ${returnQuery}
        `, { from, to });
        return this.formatResult(result);
        // return result;
    }

    private async formatResult(queryResult: QueryResult) {
        const result: GraphInput = {
            nodes: [],
            edges: []
        }
        queryResult.records.forEach((record) => {

            let nodes = record['_fields'].filter(field => (
                field.labels && field.labels[0] === 'Wallet'
            )).reduce((prev, field) => {
                const id = field.identity.low;
                const address = field.properties.address;
                prev[id] = address;
                return prev;
            }, {} as Record<number, string>);

            const edges = record['_fields'].filter(field => (
                field.type === 'SEND'
            )).map(field => {
                const start = field.start.low;
                const end = field.end.low;
                const data = field.properties;
                const from = nodes[start] as string;
                const to = nodes[end] as string;
                return { from, to, data }
            })

            nodes = Object.values(nodes);
            if (nodes.length) result.nodes.push(...nodes);
            if (edges.length) result.edges.push(...edges);
        })
        return {
            nodes: [...new Set(result.nodes)],
            edges: result.edges
        }
    }

}
