import { Injectable } from '@nestjs/common';
import { DataSnapshot } from '@prisma/client';
import { BN_ADDRESSES, THEIF_ADDRESSES } from 'src/constants/ADDRESSES';
import { EthersService } from 'src/ethers/ethers.service';
import { EtherscanService } from 'src/etherscan/etherscan.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EtherscanTransaction, TransactionReponse } from 'src/types';
import { delay } from 'src/utils';

const START_BLOCK = 10864622;
const BLOCKS_PER_DAY = 6400;
const BLOCK_INTERVAL = BLOCKS_PER_DAY * 150;
const END_BLOCK = START_BLOCK + BLOCK_INTERVAL;
const ETHERSCAN_PAGE_SIZE = 10000;
const LIMIT_PAGE = 1;

@Injectable()
export class FetchingService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly ethers: EthersService,
        private readonly etherscan: EtherscanService
    ) { }

    public async fetchPendings() {
        let pendings = await this.prisma.dataSnapshot.findMany({ where: { endBlock: { lt: END_BLOCK } } });
        let finished: string[] = [];
        let latestBlock = await this.ethers.getLatestBlockNumber();
        const endBlock = Math.min(END_BLOCK, latestBlock)

        while (pendings.length > 0) {
            try {
                const pendingFetch = pendings.shift();

                const didNotLoad = pendingFetch.endBlock < endBlock;
                const didNotComplete = !pendingFetch.isCompleted;
                const isDest = BN_ADDRESSES.map(addr => addr.toLowerCase()).includes(pendingFetch.sender);

                if ((didNotLoad || didNotComplete) && !isDest) {
                    console.log(`\n=== FETCHING DATA OF ${pendingFetch.sender} ===`)

                    const startBlock = Math.max(START_BLOCK, pendingFetch.endBlock)
                    const res = await this.fetchSenderTxs(pendingFetch.sender, startBlock, endBlock, (pendingFetch.loadedPages || 0) + 1);

                    if (res.isCompleted)
                        finished.push(pendingFetch.sender);
                    else
                        pendings.push({ sender: pendingFetch.sender, loadedPages: res.page, endBlock } as DataSnapshot)

                    const unfinished = res.senders.filter(sender => !finished.includes(sender));

                    pendings.push(...unfinished.map(sender => ({ sender } as DataSnapshot)));

                    await delay(500);
                }
            } catch (e) {
                console.log(e);
            }
        }

        console.log(`\n=== FETCHING DATA SUCCESS ===`)

        return { startBlock: START_BLOCK, toBlock: END_BLOCK };
    }

    public async fetchSenderTxs(sender: string, fromBlock: number | string, toBlock: number | string, page = 1) {
        const startBlock = await this.ethers.getBlockNumber(fromBlock);
        const endBlock = await this.ethers.getBlockNumber(toBlock);

        console.log({ startBlock, endBlock, page })

        const localTxList = await this.prisma.transaction.findMany({
            where: {
                OR: [
                    { from: sender.toLowerCase() },
                    { to: sender.toLowerCase() }
                ]
            }, select: { hash: true }
        });
        
        const localTxHashes = localTxList.map(tx => tx.hash);
        const pulledTxs: EtherscanTransaction[] = [];
        let res: TransactionReponse = null;
        let isCompleted = false;
        do {
            res = await this.etherscan.getAddressTransactions(sender, startBlock, endBlock, page);
            pulledTxs.push(...res.result);
            await delay(500);
            console.log(`Found ${res.result.length} transactions, page: `, page);
            page++;
            isCompleted = res.result.length < ETHERSCAN_PAGE_SIZE;
        } while (!isCompleted && page <= LIMIT_PAGE);

        const newTxList = [...new Set(pulledTxs.filter((tx) => !localTxHashes.includes(tx.hash)))]
        const receivers = pulledTxs.map(tx => {
            const transferInfo = this.ethers.parseTransferInfo(tx);
            return transferInfo.to;
        });

        const localReceivers = await this.prisma.dataSnapshot.findMany({ where: { sender: { in: receivers } } });
        const localReceiverAddresses = localReceivers.map(r => r.sender);

        const newSenders = [...new Set(receivers.filter((s) => !localReceiverAddresses.includes(s) && s !== sender))]

        console.log('new tx', newTxList.length);
        console.log(newTxList.map(tx => tx.hash))

        console.log('new senders', newSenders.length);
        console.log(newSenders)

        const insertTxs = this.prisma.transaction.createMany({
            data: newTxList.map(tx => {
                const transferInfo = this.ethers.parseTransferInfo(tx);
                return {
                    hash: tx.hash,
                    blockNumber: +tx.blockNumber,
                    from: transferInfo.from,
                    to: transferInfo.to,
                    input: tx.input,
                    value: tx.value,
                    token: transferInfo.token,
                    amount: +transferInfo.value,
                    timeStamp: +tx.timeStamp
                }
            })
        });

        const updateSnapshot = this.prisma.dataSnapshot.upsert({
            where: { sender: sender.toLowerCase() },
            update: { startBlock, endBlock, loadedPages: page - 1, isCompleted },
            create: { sender: sender.toLowerCase(), startBlock, endBlock, isCompleted }
        });

        const insertSenders = this.prisma.dataSnapshot.createMany({
            data: newSenders.map((sender) => ({ sender }))
        })

        await this.prisma.$transaction([insertTxs, updateSnapshot, insertSenders])

        console.log('Succeed')

        return { senders: newSenders, txCount: newTxList.length, isCompleted, page }
    }

}
