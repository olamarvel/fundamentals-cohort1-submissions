import { Router } from 'express';
import { CustomerController } from '../../controllers/customerController';
import { validateId, validatePagination } from '../../middleware/validation';

const router = Router();
const customerController = new CustomerController();

router.get('/', validatePagination, customerController.getCustomers);
router.get('/stats', customerController.getCustomerStats);
router.get('/:id', validateId, customerController.getCustomerById);

export default router;