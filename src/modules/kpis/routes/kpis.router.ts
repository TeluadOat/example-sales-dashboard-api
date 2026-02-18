import { Router, Request, Response, NextFunction } from 'express';
import { KpiController } from '../controllers/KpiController.controller';

const router = Router();

const kpiController = new KpiController();

router.get('/', (req: Request, res: Response, next: NextFunction) => kpiController.list(req, res, next));

router.post('/', (req: Request, res: Response, next: NextFunction) => kpiController.create(req, res, next));

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => kpiController.destroy(req, res, next));

router.get('/:id', (req: Request, res: Response, next: NextFunction) => kpiController.retrieve(req, res, next));

router.put('/:id', (req: Request, res: Response, next: NextFunction) => kpiController.update(req, res, next));


export const kpisRouter = router;
