import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {

    constructor(private readonly prisma: PrismaService) { }

    public async getTransactions(limit = 10, offset = 0) {
        return this.prisma.transaction.findMany({ take: limit, skip: offset })
    }

    public async getTransaction(hash: string) {
        return this.prisma.transaction.findUnique({ where: { hash } })
    }

}
