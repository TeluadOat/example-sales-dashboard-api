import { prisma } from '../../../lib/prisma';
import type { Prisma, CustomerSatisfaction } from '@prisma/client';

export class CustomerSatisfactionService {
  private readonly prisma = prisma;

  async list(): Promise<any[]> {
    return this.prisma.customerSatisfaction.findMany();
  }

  async retrieve(id: string): Promise<any> {
    return this.prisma.customerSatisfaction.findUnique({ where: { id } });
  }

  async create(data: any): Promise<any> {
    return this.prisma.customerSatisfaction.create({ data });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.customerSatisfaction.update({ where: { id }, data });
  }

  async destroy(id: string): Promise<void> {
    await this.prisma.customerSatisfaction.delete({ where: { id } });
  }

}
