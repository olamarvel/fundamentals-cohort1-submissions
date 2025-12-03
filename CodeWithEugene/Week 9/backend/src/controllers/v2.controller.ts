import { Request, Response, NextFunction } from 'express';
import { legacyApiService } from '../services/legacy-api.service';
import { transformationService } from '../services/transformation.service';
import { VersionedRequest } from '../middleware/versioning.middleware';

export class V2Controller {
  async getCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await legacyApiService.getUsers();
      const customers = transformationService.transformUsersToCustomers(users);
      
      res.json({
        version: 'v2',
        data: customers,
        count: customers.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async getCustomerById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          error: {
            code: 'INVALID_ID',
            message: 'Invalid customer ID',
          },
        });
        return;
      }

      const user = await legacyApiService.getUserById(id);
      const customer = transformationService.transformUserToCustomer(user);
      
      res.json({
        version: 'v2',
        data: customer,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async getPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payments = await legacyApiService.getMockPayments();
      const users = await legacyApiService.getUsers();
      
      const customerMap = new Map(
        users.map((user) => [user.id, user.name])
      );
      
      const transformedPayments = transformationService.transformPayments(
        payments,
        customerMap
      );

      const status = req.query.status as string | undefined;
      const filteredPayments = status
        ? transformedPayments.filter((p) => p.status === status)
        : transformedPayments;

      res.json({
        version: 'v2',
        data: filteredPayments,
        count: filteredPayments.length,
        filters: status ? { status } : {},
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          error: {
            code: 'INVALID_ID',
            message: 'Invalid payment ID',
          },
        });
        return;
      }

      const payments = await legacyApiService.getMockPayments();
      const payment = payments.find((p) => p.id === id);

      if (!payment) {
        res.status(404).json({
          error: {
            code: 'PAYMENT_NOT_FOUND',
            message: `Payment with ID ${id} not found`,
          },
        });
        return;
      }

      const users = await legacyApiService.getUsers();
      const customerMap = new Map(
        users.map((user) => [user.id, user.name])
      );
      
      const transformedPayment = transformationService.transformPayment(
        payment,
        customerMap.get(payment.userId) || 'Unknown Customer'
      );

      res.json({
        version: 'v2',
        data: transformedPayment,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async getCustomerPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = parseInt(req.params.customerId, 10);
      
      if (isNaN(customerId)) {
        res.status(400).json({
          error: {
            code: 'INVALID_ID',
            message: 'Invalid customer ID',
          },
        });
        return;
      }

      const payments = await legacyApiService.getMockPayments();
      const customerPayments = payments.filter((p) => p.userId === customerId);
      
      const users = await legacyApiService.getUsers();
      const customerMap = new Map(
        users.map((user) => [user.id, user.name])
      );
      
      const transformedPayments = transformationService.transformPayments(
        customerPayments,
        customerMap
      );

      res.json({
        version: 'v2',
        data: transformedPayments,
        count: transformedPayments.length,
        customerId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}

export const v2Controller = new V2Controller();


