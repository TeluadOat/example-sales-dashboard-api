import { Router } from 'express';
import { CustomerSatisfactionController } from '../controllers/CustomerSatisfactionController.controller';

const router = Router();

const customerSatisfactionController = new CustomerSatisfactionController();

router.get('/', (req, res, next) => customerSatisfactionController.list(req, res, next));

router.post('/', (req, res, next) => customerSatisfactionController.create(req, res, next));

router.delete('/:id', (req, res, next) => customerSatisfactionController.destroy(req, res, next));

router.get('/:id', (req, res, next) => customerSatisfactionController.retrieve(req, res, next));

router.put('/:id', (req, res, next) => customerSatisfactionController.update(req, res, next));


export const customerSatisfactionsRouter = router;
