import { Router } from 'express';
import { KpiController } from '../controllers/KpiController.controller';

const router = Router();

const kpiController = new KpiController();

router.get('/', (req, res, next) => kpiController.list(req, res, next));

router.post('/', (req, res, next) => kpiController.create(req, res, next));

router.delete('/:id', (req, res, next) => kpiController.destroy(req, res, next));

router.get('/:id', (req, res, next) => kpiController.retrieve(req, res, next));

router.put('/:id', (req, res, next) => kpiController.update(req, res, next));


export const kpisRouter = router;
