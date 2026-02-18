import { Router, Request, Response, NextFunction } from 'express';
import { CustomerSatisfactionController } from '../controllers/CustomerSatisfactionController.controller';

const router = Router();

const customerSatisfactionController = new CustomerSatisfactionController();

router.get('/', (req: Request, res: Response, next: NextFunction) => customerSatisfactionController.list(req, res, next));

router.post('/', (req: Request, res: Response, next: NextFunction) => customerSatisfactionController.create(req, res, next));

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => customerSatisfactionController.destroy(req, res, next));

router.get('/:id', (req: Request, res: Response, next: NextFunction) => customerSatisfactionController.retrieve(req, res, next));

router.put('/:id', (req: Request, res: Response, next: NextFunction) => customerSatisfactionController.update(req, res, next));


export const customerSatisfactionsRouter = router;
