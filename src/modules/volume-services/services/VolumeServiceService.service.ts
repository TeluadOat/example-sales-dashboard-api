import { prisma } from '../../../lib/prisma';
import type { Prisma, VolumeService } from '@prisma/client';

export class VolumeServiceService {
  private readonly prisma = prisma;

  async list(): Promise<any[]> {
    return this.prisma.volumeService.findMany();
  }

  async retrieve(id: string): Promise<any> {
    return this.prisma.volumeService.findUnique({ where: { id } });
  }

  async create(data: any): Promise<any> {
    return this.prisma.volumeService.create({ data });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.volumeService.update({ where: { id }, data });
  }

  async destroy(id: string): Promise<void> {
    await this.prisma.volumeService.delete({ where: { id } });
  }

}
