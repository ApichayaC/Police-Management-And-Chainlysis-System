import axios from "axios";
import { BNTickerReponse, BNTickers } from "../types";

const BASE_URL = `https://api2.binance.com`;

const getTokenPrice = () => {
    const url = `${BASE_URL}/api/v3/ticker/price`;
    return axios.get(url).then(res => {
        const data: BNTickerReponse[] = res.data;
        return data.reduce((prev, cur) => {
            prev[cur.symbol] = Number(cur.price);
            return prev;
        }, {} as BNTickers);
    });
}

export default {
    getTokenPrice
}