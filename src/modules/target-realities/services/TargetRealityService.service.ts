import { prisma } from '../../../lib/prisma';
import type { Prisma, TargetReality } from '@prisma/client';

export class TargetRealityService {
  private readonly prisma = prisma;

  async list(): Promise<any[]> {
    return this.prisma.targetReality.findMany();
  }

  async retrieve(id: string): Promise<any> {
    return this.prisma.targetReality.findUnique({ where: { id } });
  }

  async create(data: any): Promise<any> {
    return this.prisma.targetReality.create({ data });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.targetReality.update({ where: { id }, data });
  }

  async destroy(id: string): Promise<void> {
    await this.prisma.targetReality.delete({ where: { id } });
  }

}
