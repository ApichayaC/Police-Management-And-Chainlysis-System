import { Injectable } from '@nestjs/common';
import axios from 'axios';
import config from 'src/config';
import { TransactionReponse } from 'src/types';

const BASE_URL = `https://api.etherscan.io/api`;

@Injectable()
export class EtherscanService {
    public async getAddressTransactions(address: string, startblock = 0, endblock = 99999999, page = 1, sort = 'asc') {
        const url = `${BASE_URL}?module=account&action=txlist&address=${address}&startblock=${startblock}&endblock=${endblock}&page=${page}&sort=${sort}&apikey=${config.ETHERSCAN_API_KEY}`;
        return axios.get(url).then(res => res.data as TransactionReponse);
    }
}
