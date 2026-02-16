import { Router } from 'express';
import { SalesMapController } from '../controllers/SalesMapController.controller';

const router = Router();

const salesMapController = new SalesMapController();

router.get('/', (req, res, next) => salesMapController.list(req, res, next));

router.post('/', (req, res, next) => salesMapController.create(req, res, next));

router.delete('/:id', (req, res, next) => salesMapController.destroy(req, res, next));

router.get('/:id', (req, res, next) => salesMapController.retrieve(req, res, next));

router.put('/:id', (req, res, next) => salesMapController.update(req, res, next));


export const salesMapsRouter = router;
