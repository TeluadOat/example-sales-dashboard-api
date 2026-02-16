import { prisma } from '../../../lib/prisma';
import type { Prisma, Revenue } from '@prisma/client';

export class RevenueService {
  private readonly prisma = prisma;

  async list(): Promise<any[]> {
    return this.prisma.revenue.findMany();
  }

  async retrieve(id: string): Promise<any> {
    return this.prisma.revenue.findUnique({ where: { id } });
  }

  async create(data: any): Promise<any> {
    return this.prisma.revenue.create({ data });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.revenue.update({ where: { id }, data });
  }

  async destroy(id: string): Promise<void> {
    await this.prisma.revenue.delete({ where: { id } });
  }

}
