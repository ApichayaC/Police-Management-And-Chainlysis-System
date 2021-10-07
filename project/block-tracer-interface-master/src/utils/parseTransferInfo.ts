import * as ethers from 'ethers';
import { ADDRESS_TO_TOKEN, ERC20ABI } from '../common/constants';
import { EtherscanTransaction } from '../types';

const erc20Interface = new ethers.utils.Interface(ERC20ABI);

const parseTransferInfo = (tx: EtherscanTransaction) => {
    if (tx.input !== '0x') {
        try {
            const decoded = erc20Interface.parseTransaction({ data: tx.input, value: tx.value });
            const [to, value] = decoded.args;
            const tokenInfo = ADDRESS_TO_TOKEN[tx.to.toLowerCase()]
            return {
                from: tx.from,
                to: to.toString(),
                token: tokenInfo.name || tx.to,
                value: tokenInfo ? Number(value.toString()) / (10 ** tokenInfo.decimals) : ethers.utils.formatEther(value.toString())
            }
        } catch (e) {
            return {
                from: tx.from,
                to: tx.to,
                token: 'ETH',
                value: ethers.utils.formatEther(tx.value)
            }
        }
    } else {
        return {
            from: tx.from,
            to: tx.to,
            token: 'ETH',
            value: ethers.utils.formatEther(tx.value)
        }
    }
};

export default parseTransferInfo