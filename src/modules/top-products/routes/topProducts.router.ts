import { Router } from 'express';
import { TopProductController } from '../controllers/TopProductController.controller';

const router = Router();

const topProductController = new TopProductController();

router.get('/', (req, res, next) => topProductController.list(req, res, next));

router.get('/top', (req, res, next) => topProductController.listTopFive(req, res, next));

router.post('/', (req, res, next) => topProductController.create(req, res, next));

router.delete('/:id', (req, res, next) => topProductController.destroy(req, res, next));

router.get('/:id', (req, res, next) => topProductController.retrieve(req, res, next));

router.put('/:id', (req, res, next) => topProductController.update(req, res, next));


export const topProductsRouter = router;
