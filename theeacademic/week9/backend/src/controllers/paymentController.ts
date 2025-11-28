import { Request, Response, NextFunction } from 'express';
import { LegacyService } from '../services/legacyService';
import { DataTransformer } from '../utils/transformer';
import { ApiResponse, ModernPayment } from '../types';
import { AppError } from '../middleware/errorHandler';

export class PaymentController {
  private legacyService: LegacyService;

  constructor() {
    this.legacyService = new LegacyService();
  }

  getPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const legacyPayments = await this.legacyService.getPayments();
      let modernPayments = legacyPayments.map(DataTransformer.transformPayment);

      // Filter by status if provided
      if (status && ['pending', 'completed', 'failed'].includes(status)) {
        modernPayments = modernPayments.filter(payment => payment.status === status);
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPayments = modernPayments.slice(startIndex, endIndex);

      const response: ApiResponse<{
        payments: ModernPayment[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }> = {
        success: true,
        data: {
          payments: paginatedPayments,
          pagination: {
            page,
            limit,
            total: modernPayments.length,
            totalPages: Math.ceil(modernPayments.length / limit),
          },
        },
        timestamp: new Date().toISOString(),
        version: 'v2',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      
      const legacyPayment = await this.legacyService.getPaymentById(id);
      if (!legacyPayment) {
        throw new AppError('Payment not found', 404);
      }

      const modernPayment = DataTransformer.transformPayment(legacyPayment);

      const response: ApiResponse<ModernPayment> = {
        success: true,
        data: modernPayment,
        timestamp: new Date().toISOString(),
        version: 'v2',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getPaymentStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const legacyPayments = await this.legacyService.getPayments();
      const modernPayments = legacyPayments.map(DataTransformer.transformPayment);

      const stats = {
        total: modernPayments.length,
        byStatus: {
          pending: modernPayments.filter(p => p.status === 'pending').length,
          completed: modernPayments.filter(p => p.status === 'completed').length,
          failed: modernPayments.filter(p => p.status === 'failed').length,
        },
        totalAmount: modernPayments.reduce((sum, p) => sum + p.amount, 0),
        averageAmount: modernPayments.length > 0 
          ? modernPayments.reduce((sum, p) => sum + p.amount, 0) / modernPayments.length 
          : 0,
      };

      const response: ApiResponse<typeof stats> = {
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
        version: 'v2',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}