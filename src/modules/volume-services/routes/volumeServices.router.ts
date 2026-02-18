import { Router, Request, Response, NextFunction } from 'express';
import { VolumeServiceController } from '../controllers/VolumeServiceController.controller';

const router = Router();

const volumeServiceController = new VolumeServiceController();

router.get('/', (req: Request, res: Response, next: NextFunction) => volumeServiceController.list(req, res, next));

router.post('/', (req: Request, res: Response, next: NextFunction) => volumeServiceController.create(req, res, next));

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => volumeServiceController.destroy(req, res, next));

router.get('/:id', (req: Request, res: Response, next: NextFunction) => volumeServiceController.retrieve(req, res, next));

router.put('/:id', (req: Request, res: Response, next: NextFunction) => volumeServiceController.update(req, res, next));


export const volumeServicesRouter = router;
