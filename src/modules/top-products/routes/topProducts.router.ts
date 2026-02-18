import { Router, Request, Response, NextFunction } from 'express';
import { TopProductController } from '../controllers/TopProductController.controller';

const router = Router();

const topProductController = new TopProductController();

router.get('/', (req: Request, res: Response, next: NextFunction) => topProductController.list(req, res, next));

router.get('/top', (req: Request, res: Response, next: NextFunction) => topProductController.listTopFive(req, res, next));

router.post('/', (req: Request, res: Response, next: NextFunction) => topProductController.create(req, res, next));

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => topProductController.destroy(req, res, next));

router.get('/:id', (req: Request, res: Response, next: NextFunction) => topProductController.retrieve(req, res, next));

router.put('/:id', (req: Request, res: Response, next: NextFunction) => topProductController.update(req, res, next));


export const topProductsRouter = router;
