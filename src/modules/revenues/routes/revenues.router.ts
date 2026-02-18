import { Router, Request, Response, NextFunction } from 'express';
import { RevenueController } from '../controllers/RevenueController.controller';

const router = Router();

const revenueController = new RevenueController();

router.get('/', (req: Request, res: Response, next: NextFunction) => revenueController.list(req, res, next));

router.post('/', (req: Request, res: Response, next: NextFunction) => revenueController.create(req, res, next));

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => revenueController.destroy(req, res, next));

router.get('/:id', (req: Request, res: Response, next: NextFunction) => revenueController.retrieve(req, res, next));

router.put('/:id', (req: Request, res: Response, next: NextFunction) => revenueController.update(req, res, next));


export const revenuesRouter = router;
