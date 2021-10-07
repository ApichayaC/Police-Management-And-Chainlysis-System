import { ethers } from 'ethers';
import create from 'zustand';
import config from '../config';
import { BN_ADDRESSES, LOCAL_KEYS, THEIF_ADDRESSES } from '../src/common/constants';
import { SentTransactions, Transaction } from '../src/types';
import storage from '../service/storage';
import { truncateAddress } from '../util/format';

const initialAddressList = [...THEIF_ADDRESSES.ETH, ...BN_ADDRESSES];
let initialLabels: Record<string, string> = {};
THEIF_ADDRESSES.ETH.forEach((address, index) => initialLabels[address] = `Theif ${index + 1}`);
BN_ADDRESSES.forEach((address, index) => initialLabels[address] = `Binance ${index + 1}`);

// let localLabels = localStorage.getItem(LOCAL_KEYS.LABELS) || 'LABELS';
// if (localLabels) {
//     try {
//         const jsonLabels = JSON.parse(localLabels);
//         initialLabels = { ...initialLabels, ...jsonLabels };
//     } catch (e) {

//     }
// }

const initJSONRPCProvider = new ethers.providers.InfuraProvider('mainnet', config.INFURA.projectId);

interface AppStoreInterface {
    addressList: string[],
    addressLabels: Record<string, string>,
    jsonRPCProvider: ethers.providers.JsonRpcProvider,
    sentTransactions: Record<string, SentTransactions>,
    transactions: Record<string, Transaction>,
    getLabelledAddress: (address: string, options?: { truncate?: boolean, showAddress?: boolean }) => string,
    setAddressList: (addressList: string[]) => void,
    setLabel: (address: string, label: string) => void,
    deleteLabel: (address: string) => void,
    setSentTransactions: (sender: string, sentTransactions: SentTransactions) => void,
    setTransactions: (transactions: Record<string, Transaction>) => void
}

const useAppStore = create<AppStoreInterface>((set, get) => ({
    addressList: initialAddressList,
    addressLabels: initialLabels,
    jsonRPCProvider: initJSONRPCProvider,
    transactions: {},
    sentTransactions: storage.loadData(LOCAL_KEYS.SENT_TX) || {},
    getLabelledAddress: (address, options) => {
        const showAddressOpt = options ? options.showAddress : false;
        const truncateOpt = options ? options.truncate : false;

        const displayedAddr = truncateOpt ? truncateAddress(address) : address;
        const addressLabels = get().addressLabels;

        if (!addressLabels[address]) return displayedAddr;
        if (!showAddressOpt) return addressLabels[address];
        return `${addressLabels[address]} (${displayedAddr})`;
    },
    setLabel: (address, label) => {
        const labels = get().addressLabels
        const data = {
            ...labels,
            [address]: label
        }
        localStorage.setItem(LOCAL_KEYS.LABELS, JSON.stringify(data));
        set({
            addressLabels: data
        })
    },
    deleteLabel: (address) => {
        const labels = get().addressLabels;
        delete labels[address];
        set({ addressLabels: { ...labels } })
    },
    setAddressList: (addressList) => {
        set({ addressList });
    },
    setSentTransactions: (sender, sentTransactions) => {
        const result = {
            ...get().sentTransactions,
            [sender]: sentTransactions
        }
        set({ sentTransactions: result });
        storage.saveData(LOCAL_KEYS.SENT_TX, result);
    },
    setTransactions: (transactions) => {
        set({
            transactions: {
                ...get().transactions,
                ...transactions
            }
        })
    }
}))

export default useAppStore;