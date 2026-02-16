import { Router } from 'express';
import { TargetRealityController } from '../controllers/TargetRealityController.controller';

const router = Router();

const targetRealityController = new TargetRealityController();

router.get('/', (req, res, next) => targetRealityController.list(req, res, next));

router.post('/', (req, res, next) => targetRealityController.create(req, res, next));

router.delete('/:id', (req, res, next) => targetRealityController.destroy(req, res, next));

router.get('/:id', (req, res, next) => targetRealityController.retrieve(req, res, next));

router.put('/:id', (req, res, next) => targetRealityController.update(req, res, next));


export const targetRealitiesRouter = router;
