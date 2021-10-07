import { useCallback, useEffect, useState } from 'react'
import { LOCAL_KEYS, THEIF_ADDRESSES } from '../common/constants';
import etherscan from '../services/etherscan';
import { Level, SentTransactions } from '../types';
import { Select } from 'antd';
import Tracker from '../components/Tracker';
import useAppStore from '../store';
import parseTransferInfo from '../utils/parseTransferInfo';

const initialData = THEIF_ADDRESSES.ETH.reduce((prev, addr) => {
    const level = 0;
    prev[addr] = [];
    prev[addr][level] = { [addr]: null }
    return prev;
}, {} as Record<string, Level[]>);

const Manual = () => {

    const [address, setAddress] = useState(THEIF_ADDRESSES.ETH[0]);
    const [data, setData] = useState(initialData);
    const [startBlocks, setStartBlocks] = useState([0]);
    const levels = data[address] || [];

    const getLabelledAddress = useAppStore(state => state.getLabelledAddress);
    useAppStore(state => state.addressLabels);

    useEffect(() => {
        const localData = localStorage.getItem(LOCAL_KEYS.DATA);
        const localStartBlocks = localStorage.getItem(LOCAL_KEYS.START_BLOCKS);

        if (localData) {
            try {
                setData(JSON.parse(localData));
            } catch (e) { }
        }

        if (localStartBlocks) {
            try {
                setStartBlocks(JSON.parse(localStartBlocks))
            } catch (e) { }
        }
    }, []);

    const addressOptions = THEIF_ADDRESSES.ETH.map(addr => ({ label: getLabelledAddress(addr), value: addr }))

    const handleLoadTx = useCallback(async (level: number, from: string, startBlock: number) => {
        const response = await etherscan.getAddressTransactions(from, startBlock);

        const sentTransactions = response.result.reduce((prev, tx) => {
            const transferInfo = parseTransferInfo(tx);
            const { to } = transferInfo;
            if (to === "" || from === to) return prev;
            if (!prev[to]) prev[to] = [];
            prev[to].push({ ...tx, transferInfo });
            return prev;
        }, {} as SentTransactions);

        Object.keys(sentTransactions).map(to => {
            if (!data[address][level + 1])
                data[address][level + 1] = {};
            if (!data[address][level + 1][to])
                data[address][level + 1][to] = null;
        });

        const earliestBlock = response.result.reduce((prev, tx) => prev < parseInt(tx.blockNumber) ? prev : parseInt(tx.blockNumber), Infinity);
        startBlocks[level + 1] = earliestBlock;

        data[address][level][from] = sentTransactions;

        const newData = { ...data };
        const newStartBlocks = [...startBlocks];

        setData(newData);
        setStartBlocks(newStartBlocks);

        localStorage.setItem(LOCAL_KEYS.DATA, JSON.stringify(newData));
        localStorage.setItem(LOCAL_KEYS.START_BLOCKS, JSON.stringify(newStartBlocks));

    }, [address, data, startBlocks]);

    return (
        <div>
            <div className="mb-5">Looking At: <Select options={addressOptions} onChange={v => setAddress(v as string)} value={address} /></div>
            <div className="space-y-4">
                {levels.map((data, index) => (
                    <div className={index !== 0 ? 'border-t-2 pt-4' : ''}>
                        <Tracker
                            key={index}
                            level={index}
                            data={data}
                            startBlock={startBlocks[index]}
                            loadSentTransactions={handleLoadTx}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Manual
