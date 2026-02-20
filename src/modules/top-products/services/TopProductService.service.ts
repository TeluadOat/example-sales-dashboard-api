import { prisma } from '../../../lib/prisma';
import type { Prisma, TopProduct } from '@prisma/client';

export class TopProductService {
  private readonly prisma = prisma;

  async list(): Promise<any[]> {
    return this.prisma.topProduct.findMany();
  }

  async listTopFive(): Promise<TopProduct[]> {
    const totalUnitsResult = await prisma.topProduct.aggregate({
      _sum: { unitsSold: true },
    });
    const totalUnits = totalUnitsResult._sum.unitsSold ?? 0;

    const products = await this.prisma.topProduct.findMany({
      orderBy: { totalSales: "desc" },
      take: 5,
    });

    if (products.length === 0) return [];

    return products.map((p, i) => ({
      ...p,
      popularityPercent: totalUnits > 0 ? (p.unitsSold / totalUnits) * 100 : 0,
      color: `hsl(${(i / products.length) * 360}, 70%, 50%)`,
    }))
  }

  async retrieve(id: string): Promise<any> {
    return this.prisma.topProduct.findUnique({ where: { id } });
  }

  async create(data: any): Promise<any> {
    return this.prisma.topProduct.create({ data });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.topProduct.update({ where: { id }, data });
  }

  async destroy(id: string): Promise<void> {
    await this.prisma.topProduct.delete({ where: { id } });
  }

}
