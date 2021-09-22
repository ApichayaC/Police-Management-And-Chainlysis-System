import { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import { createDriver } from './neo4j.utils';
import { Neo4jConfig, Neo4jScheme } from './interfaces/neo4j-config.interface'
import { NEO4J_OPTIONS, NEO4J_DRIVER } from './constants/neo4j-repo.constant';
import config from 'src/config';

@Module({
  providers: [
    {
      provide: NEO4J_OPTIONS,
      useValue: {
        scheme: config.NEO4J_SCHEME as Neo4jScheme,
        host: config.NEO4J_HOST,
        port: config.NEO4J_PORT,
        username: config.NEO4J_USERNAME,
        password: config.NEO4J_PASSWORD,
        database: config.NEO4J_DB,
      }
    },
    {
      provide: NEO4J_DRIVER,
      inject: [NEO4J_OPTIONS],
      useFactory: async (config: Neo4jConfig) => createDriver(config)
    },
    Neo4jService
  ],
  exports: [Neo4jService]
})
export class Neo4jModule { }
//   static forRoot(config: Neo4jConfig): DynamicModule {
//     return {
//       module: Neo4jModule,
//       providers: [
//         {
//           provide: NEO4J_OPTIONS,
//           useValue: config
//         },
//         {
//           provide: NEO4J_DRIVER,
//           inject: [NEO4J_OPTIONS],
//           useFactory: async (config: Neo4jConfig) => createDriver(config)
//         },
//         Neo4jService
//       ],
//       exports: [Neo4jService]
//     }
//   }
// }
