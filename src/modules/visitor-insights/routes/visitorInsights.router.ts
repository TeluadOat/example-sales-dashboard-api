import { Router } from 'express';
import { VisitorInsightController } from '../controllers/VisitorInsightController.controller';

const router = Router();

const visitorInsightController = new VisitorInsightController();

router.get('/', (req, res, next) => visitorInsightController.list(req, res, next));

router.post('/', (req, res, next) => visitorInsightController.create(req, res, next));

router.delete('/:id', (req, res, next) => visitorInsightController.destroy(req, res, next));

router.get('/:id', (req, res, next) => visitorInsightController.retrieve(req, res, next));

router.put('/:id', (req, res, next) => visitorInsightController.update(req, res, next));


export const visitorInsightsRouter = router;
