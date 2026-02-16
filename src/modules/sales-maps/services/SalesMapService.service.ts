import { prisma } from '../../../lib/prisma';
import type { Prisma, SalesMap } from '@prisma/client';

export class SalesMapService {
  private readonly prisma = prisma;

  async list(): Promise<any[]> {
    return this.prisma.salesMap.findMany();
  }

  async retrieve(id: string): Promise<any> {
    return this.prisma.salesMap.findUnique({ where: { id } });
  }

  async create(data: any): Promise<any> {
    return this.prisma.salesMap.create({ data });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.salesMap.update({ where: { id }, data });
  }

  async destroy(id: string): Promise<void> {
    await this.prisma.salesMap.delete({ where: { id } });
  }

}
