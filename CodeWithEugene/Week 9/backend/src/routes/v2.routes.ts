import { Router } from 'express';
import { v2Controller } from '../controllers/v2.controller';

const router = Router();

router.get('/customers', v2Controller.getCustomers.bind(v2Controller));
router.get('/customers/:id', v2Controller.getCustomerById.bind(v2Controller));
router.get('/payments', v2Controller.getPayments.bind(v2Controller));
router.get('/payments/:id', v2Controller.getPaymentById.bind(v2Controller));
router.get('/customers/:customerId/payments', v2Controller.getCustomerPayments.bind(v2Controller));

export default router;


