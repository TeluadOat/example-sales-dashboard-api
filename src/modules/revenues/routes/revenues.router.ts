import { Router } from 'express';
import { RevenueController } from '../controllers/RevenueController.controller';

const router = Router();

const revenueController = new RevenueController();

router.get('/', (req, res, next) => revenueController.list(req, res, next));

router.post('/', (req, res, next) => revenueController.create(req, res, next));

router.delete('/:id', (req, res, next) => revenueController.destroy(req, res, next));

router.get('/:id', (req, res, next) => revenueController.retrieve(req, res, next));

router.put('/:id', (req, res, next) => revenueController.update(req, res, next));


export const revenuesRouter = router;
