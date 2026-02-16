import { prisma } from '../../../lib/prisma';
import type { Prisma, VisitorInsight } from '@prisma/client';

export class VisitorInsightService {
  private readonly prisma = prisma;

  async list(): Promise<any[]> {
    return this.prisma.visitorInsight.findMany();
  }

  async retrieve(id: string): Promise<any> {
    return this.prisma.visitorInsight.findUnique({ where: { id } });
  }

  async create(data: any): Promise<any> {
    return this.prisma.visitorInsight.create({ data });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.visitorInsight.update({ where: { id }, data });
  }

  async destroy(id: string): Promise<void> {
    await this.prisma.visitorInsight.delete({ where: { id } });
  }

}
