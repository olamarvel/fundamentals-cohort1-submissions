import { Router } from 'express';
import { PaymentController } from '../../controllers/paymentController';
import { validateId, validatePagination } from '../../middleware/validation';

const router = Router();
const paymentController = new PaymentController();

router.get('/', validatePagination, paymentController.getPayments);
router.get('/stats', paymentController.getPaymentStats);
router.get('/:id', validateId, paymentController.getPaymentById);

export default router;