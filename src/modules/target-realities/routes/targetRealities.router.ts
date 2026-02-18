import { Router, Request, Response, NextFunction } from 'express';
import { TargetRealityController } from '../controllers/TargetRealityController.controller';

const router = Router();

const targetRealityController = new TargetRealityController();

router.get('/', (req: Request, res: Response, next: NextFunction) => targetRealityController.list(req, res, next));

router.post('/', (req: Request, res: Response, next: NextFunction) => targetRealityController.create(req, res, next));

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => targetRealityController.destroy(req, res, next));

router.get('/:id', (req: Request, res: Response, next: NextFunction) => targetRealityController.retrieve(req, res, next));

router.put('/:id', (req: Request, res: Response, next: NextFunction) => targetRealityController.update(req, res, next));


export const targetRealitiesRouter = router;
