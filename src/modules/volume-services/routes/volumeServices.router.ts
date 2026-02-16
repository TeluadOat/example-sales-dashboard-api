import { Router } from 'express';
import { VolumeServiceController } from '../controllers/VolumeServiceController.controller';

const router = Router();

const volumeServiceController = new VolumeServiceController();

router.get('/', (req, res, next) => volumeServiceController.list(req, res, next));

router.post('/', (req, res, next) => volumeServiceController.create(req, res, next));

router.delete('/:id', (req, res, next) => volumeServiceController.destroy(req, res, next));

router.get('/:id', (req, res, next) => volumeServiceController.retrieve(req, res, next));

router.put('/:id', (req, res, next) => volumeServiceController.update(req, res, next));


export const volumeServicesRouter = router;
