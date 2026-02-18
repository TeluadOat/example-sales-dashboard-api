import { Router, Request, Response, NextFunction } from 'express';
import { SalesMapController } from '../controllers/SalesMapController.controller';

const router = Router();

const salesMapController = new SalesMapController();

router.get('/', (req: Request, res: Response, next: NextFunction) => salesMapController.list(req, res, next));

router.post('/', (req: Request, res: Response, next: NextFunction) => salesMapController.create(req, res, next));

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => salesMapController.destroy(req, res, next));

router.get('/:id', (req: Request, res: Response, next: NextFunction) => salesMapController.retrieve(req, res, next));

router.put('/:id', (req: Request, res: Response, next: NextFunction) => salesMapController.update(req, res, next));


export const salesMapsRouter = router;
