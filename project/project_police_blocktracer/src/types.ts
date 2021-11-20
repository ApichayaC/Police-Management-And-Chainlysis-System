export type EtherscanTransaction = {
    blockHash: string,
    blockNumber: string,
    confirmations: string,
    contractAddress: string,
    cumulativeGasUsed: string,
    from: string,
    gas: string,
    gasPrice: string,
    gasUsed: string,
    hash: string,
    input: string,
    isError: string,
    nonce: string,
    timeStamp: string,
    to: string,
    transactionIndex: string,
    txreceipt_status: string,
    value: string
}

export type TransactionReponse = {
    message: string,
    result: EtherscanTransaction[]
}

export type BNTickerReponse = {
    symbol: string,
    price: string
}

export type BNTickers = Record<string, number>

export type Transaction = EtherscanTransaction & {
    transferInfo: {
        from: string,
        to: string,
        token: string,
        value: string | number
    }
}

export type SentTransactions = Record<string, Transaction[]>

export type Level = Record<string, SentTransactions | null>;

export type TokenInfo = {
    name: string,
    decimals: number
}

export type Edge ={
    from: string,
    to: string,
    data: any,
    amount: any
}

export type GraphInput = {
    nodes: string[],
    edges: Edge[]
}