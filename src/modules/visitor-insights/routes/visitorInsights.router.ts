import { Router, Request, Response, NextFunction } from 'express';
import { VisitorInsightController } from '../controllers/VisitorInsightController.controller';

const router = Router();

const visitorInsightController = new VisitorInsightController();

router.get('/', (req: Request, res: Response, next: NextFunction) => visitorInsightController.list(req, res, next));

router.post('/', (req: Request, res: Response, next: NextFunction) => visitorInsightController.create(req, res, next));

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => visitorInsightController.destroy(req, res, next));

router.get('/:id', (req: Request, res: Response, next: NextFunction) => visitorInsightController.retrieve(req, res, next));

router.put('/:id', (req: Request, res: Response, next: NextFunction) => visitorInsightController.update(req, res, next));


export const visitorInsightsRouter = router;
