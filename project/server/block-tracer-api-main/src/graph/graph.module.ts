import { Module } from '@nestjs/common';
import { GraphService } from './graph.service';
import { GraphController } from './graph.controller';
import { Neo4jModule } from 'src/neo4j/neo4j.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [GraphController],
  providers: [GraphService],
  imports: [Neo4jModule, TransactionModule, PrismaModule]
})
export class GraphModule {}
