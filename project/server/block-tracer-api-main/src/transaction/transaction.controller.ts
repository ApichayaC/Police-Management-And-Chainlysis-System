import { Controller, Get, Param, Query } from '@nestjs/common';
import { PageQueryPipe } from 'src/common/pipe/page.pipe';
import { PageQuery } from 'src/common/query/page.query';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getTransactions(@Query(PageQueryPipe) query: PageQuery)  {
    return this.transactionService.getTransactions(query.limit, query.offset);
  }

  @Get('hash')
  async getTransaction(@Param('hash') hash: string)  {
    return this.transactionService.getTransaction(hash);
  }


}
