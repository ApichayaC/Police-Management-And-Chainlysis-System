import { Module } from '@nestjs/common';
import { FetchingModule } from './fetching/fetching.module';
import { PrismaModule } from './prisma/prisma.module';
import { EthersModule } from './ethers/ethers.module';
import { EtherscanModule } from './etherscan/etherscan.module';
import { Neo4jModule } from './neo4j/neo4j.module';
import { GraphModule } from './graph/graph.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    FetchingModule,
    PrismaModule,
    EthersModule,
    EtherscanModule,
    Neo4jModule,
    GraphModule,
    TransactionModule
  ],
})
export class AppModule { }
