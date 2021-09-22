import { Module } from '@nestjs/common';
import { EtherscanService } from './etherscan.service';
import { EtherscanController } from './etherscan.controller';

@Module({
  controllers: [EtherscanController],
  providers: [EtherscanService],
  exports: [EtherscanService]
})
export class EtherscanModule {}
