import { Controller, Get, ParseIntPipe, Query, ValidationPipe } from '@nestjs/common';
import { PageQueryPipe } from 'src/common/pipe/page.pipe';
import { PageQuery } from 'src/common/query/page.query';
import { GraphService } from './graph.service';
import { TraceQuery } from './query/trace.query';

@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) { }

  @Get('trace')
  async getRelations(@Query() query: TraceQuery) {
    return this.graphService.getRelations(query.from, query.to, +query.level);
  }

  @Get('put')
  async autoPut() {
    this.graphService.autoPut();
    return true;
  }

  @Get('put/manual')
  async putGraph(@Query(PageQueryPipe) query: PageQuery) {
    return this.graphService.putGraph(query.limit, query.offset);
  }

}
