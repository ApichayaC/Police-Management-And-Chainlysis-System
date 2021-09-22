require('dotenv').config()

const config = {
    PORT: process.env.PORT || 4000,
    DEFAULT_PAGE_SIZE: Number(process.env.DEFAULT_PAGE_SIZE) || 10,

    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY || "",

    INFURA_WSS: process.env.INFURA_WSS || "",
    INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID || "",
    INFURA_PROJECT_SECRET: process.env.INFURA_PROJECT_SECRET || "",

    NEO4J_SCHEME: process.env.NEO4J_SCHEME || "neo4j",
    NEO4J_HOST: process.env.NEO4J_HOST || "localhost",
    NEO4J_PORT: process.env.NEO4J_PORT || "7687",
    NEO4J_USERNAME: process.env.NEO4J_USERNAME || "neo4j",
    NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || "neo4j_password",
    NEO4J_DB: process.env.NEO4J_DB || "neo4j",

}

export default config;