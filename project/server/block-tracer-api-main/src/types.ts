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

export type TokenInfo = {
    name: string,
    decimals: number
}

export type Edge = {
    from: string,
    to: string,
    data: any
}

export type GraphInput = {
    nodes: string[],
    edges: Edge[]
}