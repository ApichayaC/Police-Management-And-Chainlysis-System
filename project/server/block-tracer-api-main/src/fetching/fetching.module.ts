import { Module } from '@nestjs/common';
import { FetchingService } from './fetching.service';
import { FetchingController } from './fetching.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EthersModule } from 'src/ethers/ethers.module';
import { EtherscanModule } from 'src/etherscan/etherscan.module';

@Module({
  controllers: [FetchingController],
  providers: [FetchingService],
  imports: [PrismaModule, EthersModule, EtherscanModule]
})
export class FetchingModule { }
