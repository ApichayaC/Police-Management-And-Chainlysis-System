import { Button, Select } from 'antd';
import { useEffect, useState } from 'react'
import { THEIF_ADDRESSES, BN_ADDRESSES } from '../common/constants';
import etherscan from '../services/etherscan';
import useAppStore from '../store';
import { formatBlockDate } from '../utils';
import delay from '../utils/delay';
import { ArrowRightOutlined } from '@ant-design/icons';
import includeNonCaseSensitive from '../utils/includeNonCaseSensitive';
import firebase from 'firebase';
import { Transaction } from '../types';
import LabelAddress from '../components/LabelAddress';
import { ethers } from 'ethers';

const LIMIT_DEEP = 5;

const createEtherscanLink = (txId: string) => `https://etherscan.io/tx/${txId}`;

const Search = () => {
    const [address, setAddress] = useState(THEIF_ADDRESSES.ETH[0]);

    const [goal, setGoal] = useState(1);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<string[][]>([]);
    const [txIds, setTxIds] = useState<string[][]>([]);
    const [running, setRunning] = useState(false);
    const [blocks, setBlocks] = useState<Record<number, ethers.providers.Block>>({});

    useAppStore(state => state.addressLabels);
    const transactions = useAppStore(state => state.transactions);
    const sentTransactions = useAppStore(state => state.sentTransactions);
    const jsonRPCProvider = useAppStore(state => state.jsonRPCProvider);

    const getLabelledAddress = useAppStore(state => state.getLabelledAddress);
    const setSentTransactions = useAppStore(state => state.setSentTransactions);
    const setTransactions = useAppStore(state => state.setTransactions);

    useEffect(() => {
        firebase.firestore().collection('transactions').get().then(col => {
            const txList = col.docs.reduce((prev, doc) => {
                prev[doc.id] = doc.data() as Transaction;
                return prev;
            }, {} as Record<string, Transaction>);
            setTransactions(txList);
        })
    }, []);

    const addressOptions = THEIF_ADDRESSES.ETH.map(addr => ({ label: getLabelledAddress(addr), value: addr }));

    const search = async (curRoute: string[], txIds: string[], blockNumber: number) => {
        if (curRoute.length < 1) return;

        const cur = curRoute[curRoute.length - 1];

        const isDesiredDest = includeNonCaseSensitive(BN_ADDRESSES, cur);

        if (isDesiredDest) {
            setResults(state => [...state, curRoute]);
            setTxIds(state => [...state, txIds]);
            setProgress(state => state + 1);
            return;
        }
        if (curRoute.length >= LIMIT_DEEP) {
            setProgress(state => state + 1);
            return;
        }

        if (!sentTransactions[cur]) {
            const data = await etherscan.getSentTransactions(cur, 0);
            Object.values(data.sentTransactions).forEach(txList => {
                txList.forEach(item => {
                    firebase.firestore().collection('transactions').doc(item.hash).set(item)
                })
            })
            await delay(500);
            sentTransactions[cur] = data.sentTransactions;
            setSentTransactions(cur, data.sentTransactions);
        }

        const sentTransactionsArr = Object.entries(sentTransactions[cur]);
        setGoal(state => state + sentTransactionsArr.length);

        for (let i = 0; i < sentTransactionsArr.length; i++) {
            const [to, txList] = sentTransactionsArr[i];
            const filteredTxList = txList.filter(tx => {
                const isNotPassed = +tx.blockNumber >= +blockNumber;
                const isNotReverse = !includeNonCaseSensitive(curRoute, to);
                return isNotPassed && isNotReverse;
            });
            const sortedTxList = filteredTxList.sort((a, b) => +a.blockNumber - +b.blockNumber);

            if (filteredTxList.length > 0) {
                const earliestBlock = sortedTxList[0].blockNumber;
                const txHash = sortedTxList[0].hash;
                await delay(1);
                await search([...curRoute, to], [...txIds, txHash], +earliestBlock);
            }
        }

        setProgress(state => state + 1);
    }

    const getBlock = (blockNumber: number) => {
        if (blocks[blockNumber]) {
            return blocks[blockNumber];
        } else {
            jsonRPCProvider.getBlock(Number(blockNumber)).then(block => setBlocks(state => ({ ...state, [blockNumber]: block})));
            return null;
        }
    }

    const handleStart = async () => {
        setRunning(true);
        await search([address], [''], 0);
        setRunning(false);
    }

    const renderResult = (addressList: string[], index: number) => {
        if (addressList.length <= 1) return <LabelAddress address={addressList[0]}/>;
        else return (
            <>
                <div><LabelAddress address={addressList[0]}/></div>
                {addressList.slice(1).map((addr, j) => {
                    const hash = txIds[index] ? txIds[index][j + 1] : null;
                    const link = hash ? createEtherscanLink(hash) : '';
                    const tx = hash ? transactions[hash] : null;
                    const block = tx ? getBlock(+tx.blockNumber) : null;
                    const formattedTime = block ? formatBlockDate(block) : '';
                    return (
                        <div key={j} className="flex space-x-4 items-center">
                            <div className="flex flex-col justify-center items-center">
                                <div><a href={link} target="_blank"><ArrowRightOutlined /></a> </div>
                                {tx && <div className="text-xs text-gray-400">({tx.transferInfo.value.toLocaleString()} {tx.transferInfo.token} at {formattedTime})</div>}
                            </div>
                            <div><LabelAddress address={addr}/></div>
                        </div>
                    )
                })}
            </>
        )
    }

    return (
        <div>
            <h1 className="text-lg mb-5">Search Page</h1>
            <div className="mb-5">Looking At: <Select options={addressOptions} onChange={v => setAddress(v as string)} value={address} /></div>
            <div className="mb-5"><Button type="primary" onClick={handleStart}>Start</Button></div>
            {
                running && (
                    <div>
                        <div>Progress: {progress.toLocaleString()}/{goal.toLocaleString()} ({(progress * 100 / goal).toLocaleString()} %)</div>
                    </div>
                )
            }
            {
                results.length > 0 && (
                    <div>
                        <h3>Results</h3>
                        {
                            results.map((result, index) => (
                                <div key={index} className="flex space-x-2 flex-wrap mb-4 items-center">
                                    <div>{index + 1}. </div>
                                    {renderResult(result, index)}
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default Search
