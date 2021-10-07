import React, { useMemo, useState } from 'react'
import { Transaction } from '../../types';
import { Space } from 'antd';
import { ethers } from 'ethers';
import { formatBlockDate, withCommas } from '../../utils';
import useAppStore from '../../store';
import useSWR from 'swr';
import binance from '../../services/binance';
import LabelAddress from '../LabelAddress';

const BLOCK_BASEURL = `https://etherscan.io/block`;
const TX_BASEURL = `https://etherscan.io/tx`;

interface TxItemProps {
    to: string,
    transactions?: Transaction[]
}

const TxItem: React.FC<TxItemProps> = ({ to, transactions }) => {

    const [expanded, setExpanded] = useState(false);
    const [maxDisplay, setMaxDisplay] = useState(20);
    const jsonRPCProvider = useAppStore(state => state.jsonRPCProvider);

    const fromBlockNumber = (transactions && transactions.length > 0) ? transactions[0].blockNumber : null;
    const toBlockNumber = (transactions && transactions.length > 0) ? transactions[transactions.length - 1].blockNumber : null;

    const { data: fromBlock } = useSWR(`blockTs/${fromBlockNumber}`, () => jsonRPCProvider.getBlock(Number(fromBlockNumber)));
    const { data: toBlock } = useSWR(`blockTs/${toBlockNumber}`, () => jsonRPCProvider.getBlock(Number(toBlockNumber)));
    const { data: tokenPrices } = useSWR(`tokenPrices`, binance.getTokenPrice);

    const timeStr = fromBlockNumber !== null ?
        (fromBlockNumber !== toBlockNumber ?
            `From ${formatBlockDate(fromBlock)} to ${formatBlockDate(toBlock)}` : `At ${formatBlockDate(fromBlock)}`) :
        `Error no data`;

    const totalValue = useMemo(() => {
        if (!transactions) return 0;
        return transactions.reduce((prev, transaction) => {
            const { token, value } = transaction.transferInfo;
            if (token === 'USDT') return prev + Number(value);
            else {
                if (!tokenPrices) return prev;
                const price = tokenPrices[`${token}USDT`] || 0;
                return prev + price * Number(value)
            }
        }, 0);
    }, [tokenPrices, transactions]);

    const toggleExpand = () => {
        setExpanded(!expanded)
    }

    const showMore = () => {
        setMaxDisplay(maxDisplay + 20);
    }

    const numTx = transactions ? transactions.length : 0;

    const expandText = expanded ? `Hide (${numTx} items)` : `Show (${numTx} items)`;

    return (
        <div className="mb-2">
            <Space align="baseline" className="mb-1">
                <LabelAddress address={to} />
                {transactions && <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={toggleExpand} >{expandText}</div>}
            </Space>
            <div className="mb-2  font-bold">
                ({timeStr} - ${totalValue.toLocaleString()})
            </div>
            <div className="space-y-1 text-gray-400">
                {
                    (expanded && transactions) && (
                        <div>
                            {transactions.slice(0, maxDisplay).map((transaction) => {
                                const blockLink = `${BLOCK_BASEURL}/${transaction.blockNumber}`;
                                const txLink = `${TX_BASEURL}/${transaction.hash}`;
                                return (
                                    <div key={transaction.hash}>
                                        <span>Block </span>
                                        <span><a href={blockLink} target="_blank">{transaction.blockNumber}</a>: </span>
                                        <span>{withCommas(transaction.transferInfo.value)} {transaction.transferInfo.token} </span>
                                        <span><a href={txLink} target="_blank">(Check Tx)</a> </span>
                                    </div>
                                )
                            })}
                            {transactions.length > maxDisplay && (
                                <div className="cursor-pointer text-blue-400" onClick={showMore}>Show more</div>
                            )}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default TxItem
