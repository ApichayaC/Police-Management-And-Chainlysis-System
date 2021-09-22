import { Inject, Injectable } from '@nestjs/common';
import { Result, Session, session } from 'neo4j-driver';
import { NEO4J_DRIVER, NEO4J_OPTIONS } from './constants/neo4j-repo.constant';

@Injectable()
export class Neo4jService {

    constructor(
        @Inject(NEO4J_OPTIONS) private readonly config,
        @Inject(NEO4J_DRIVER) private readonly driver
    ) {}

    getReadSession(database?: string): Session {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: session.READ,
        })
    }

    read(cypher: string, params: Record<string, any>, database?: string): Result {
        const session = this.getReadSession(database)
        return session.run(cypher, params)
    }
    
    getWriteSession(database?: string): Session  {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: session.WRITE,
        })
    }

    write(cypher: string, params: Record<string, any>, database?: string): Result {
        const session = this.getWriteSession(database)
        return session.run(cypher, params)
    }
    
}
