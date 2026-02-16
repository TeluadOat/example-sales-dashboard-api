import { prisma } from '../../../lib/prisma';
import type { Prisma, Kpi } from '@prisma/client';

export class KpiService {
  private readonly prisma = prisma;

  async list(): Promise<any[]> {
    return this.prisma.kpi.findMany();
  }

  async retrieve(id: string): Promise<any> {
    return this.prisma.kpi.findUnique({ where: { id } });
  }

  async create(data: any): Promise<any> {
    return this.prisma.kpi.create({ data });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.kpi.update({ where: { id }, data });
  }

  async destroy(id: string): Promise<void> {
    await this.prisma.kpi.delete({ where: { id } });
  }

}
