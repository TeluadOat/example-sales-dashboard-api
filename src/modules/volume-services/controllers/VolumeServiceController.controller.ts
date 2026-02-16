import { Request, Response, NextFunction } from 'express';
import { VolumeServiceService } from '../services/VolumeServiceService.service';

export class VolumeServiceController {
  private readonly service = new VolumeServiceService();

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.create(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async retrieve(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.retrieve(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.destroy(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.list();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

}
