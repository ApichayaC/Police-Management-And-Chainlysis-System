import axios from "axios";
import config from "../config";
import { SentTransactions, TransactionReponse } from "../types";
import parseTransferInfo from "../utils/parseTransferInfo";

const BASE_URL = `https://api.etherscan.io/api`;

const getAddressTransactions = (address: string, startblock = 0, endblock = 99999999, sort = 'asc') => {
    const url = `${BASE_URL}?module=account&action=txlist&address=${address}&startblock=${startblock}&endblock=${endblock}&sort=${sort}&apikey=${config.ETHERSCAN_API_KEY}`;
    return axios.get(url).then(res => res.data as TransactionReponse);
}

const getSentTransactions = async (address: string, startblock = 0, endblock = 99999999, sort = 'asc') => {
    const response = await getAddressTransactions(address, startblock, endblock, sort);

    const sentTransactions = response.result.reduce((prev, tx) => {
        const transferInfo = parseTransferInfo(tx);
        const { from, to } = transferInfo;
        if (to === "" || from === to) return prev;
        if (!prev[to]) prev[to] = [];
        prev[to].push({ ...tx, transferInfo });
        return prev;
    }, {} as SentTransactions);

    const earliestBlock = response.result.reduce((prev, tx) => prev < parseInt(tx.blockNumber) ? prev : parseInt(tx.blockNumber), Infinity);

    return {
        response,
        sentTransactions,
        earliestBlock
    }
}

export default {
    getAddressTransactions,
    getSentTransactions
}