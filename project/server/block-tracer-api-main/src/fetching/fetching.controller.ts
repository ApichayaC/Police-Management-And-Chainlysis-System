import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FetchingService } from './fetching.service';

@Controller('fetching')
export class FetchingController {
  constructor(private readonly fetchingService: FetchingService) { }

  @Get('/sender')
  async fetchSenderTxs(@Query('sender') sender: string, @Query('fromBlock') fromBlock: string, @Query('toBlock') toBlock: string,) {
    this.fetchingService.fetchSenderTxs(sender, fromBlock, toBlock);
    return true;
  }

  @Get('/pendings')
  async fetchPendings() {
    this.fetchingService.fetchPendings();
    return true;
  }
}
