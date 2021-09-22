import { Injectable } from '@nestjs/common';
import * as ethers from 'ethers';
import config from 'src/config';
import { ADDRESS_TO_TOKEN } from 'src/constants/ADDRESS_TO_TOKEN';
import { ERC20ABI } from 'src/constants/ERC20ABI';
import { EtherscanTransaction } from 'src/types';

@Injectable()
export class EthersService {

    private provider: ethers.providers.InfuraProvider;

    constructor() {
        this.provider = new ethers.providers.InfuraProvider('mainnet', config.INFURA_PROJECT_ID);
    }

    public async getBlockNumber(blockNumber: number | string) {
        if (["genesis", "oldest", "first"].includes(blockNumber as string)) return 0;
        else if (["latest"].includes(blockNumber as string)) return this.getLatestBlockNumber();
        else if (!isNaN(+blockNumber)) return +blockNumber;
        return 0;
    }

    public async getLatestBlockNumber() {
        return this.provider.getBlockNumber();
    }

    public parseTransferInfo(tx: EtherscanTransaction) {
        const erc20Interface = new ethers.utils.Interface(ERC20ABI);
        if (tx.input !== '0x') {
            try {
                const decoded = erc20Interface.parseTransaction({ data: tx.input, value: tx.value });
                const [to, value] = decoded.args;
                const tokenInfo = ADDRESS_TO_TOKEN[tx.to.toLowerCase()]
                return {
                    from: tx.from.toLowerCase(),
                    to: to.toString().toLowerCase(),
                    token: tokenInfo.name || tx.to,
                    value: tokenInfo ? Number(value.toString()) / (10 ** tokenInfo.decimals) : ethers.utils.formatEther(value.toString())
                }
            } catch (e) {
                return {
                    from: tx.from.toLowerCase(),
                    to: tx.to.toLowerCase(),
                    token: 'ETH',
                    value: ethers.utils.formatEther(tx.value)
                }
            }
        } else {
            return {
                from: tx.from.toLowerCase(),
                to: tx.to.toLowerCase(),
                token: 'ETH',
                value: ethers.utils.formatEther(tx.value)
            }
        }
    };


}
