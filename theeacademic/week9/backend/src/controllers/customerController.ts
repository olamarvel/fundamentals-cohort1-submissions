import { Request, Response, NextFunction } from 'express';
import { LegacyService } from '../services/legacyService';
import { DataTransformer } from '../utils/transformer';
import { ApiResponse, ModernCustomer } from '../types';
import { AppError } from '../middleware/errorHandler';

export class CustomerController {
  private legacyService: LegacyService;

  constructor() {
    this.legacyService = new LegacyService();
  }

  getCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const legacyCustomers = await this.legacyService.getCustomers();
      let modernCustomers = legacyCustomers.map(DataTransformer.transformCustomer);

      // Search functionality
      if (search) {
        const searchLower = search.toLowerCase();
        modernCustomers = modernCustomers.filter(customer =>
          customer.fullName.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower) ||
          customer.company?.toLowerCase().includes(searchLower)
        );
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCustomers = modernCustomers.slice(startIndex, endIndex);

      const response: ApiResponse<{
        customers: ModernCustomer[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }> = {
        success: true,
        data: {
          customers: paginatedCustomers,
          pagination: {
            page,
            limit,
            total: modernCustomers.length,
            totalPages: Math.ceil(modernCustomers.length / limit),
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

  getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      
      const legacyCustomer = await this.legacyService.getCustomerById(id);
      if (!legacyCustomer) {
        throw new AppError('Customer not found', 404);
      }

      const modernCustomer = DataTransformer.transformCustomer(legacyCustomer);

      const response: ApiResponse<ModernCustomer> = {
        success: true,
        data: modernCustomer,
        timestamp: new Date().toISOString(),
        version: 'v2',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getCustomerStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const legacyCustomers = await this.legacyService.getCustomers();
      const modernCustomers = legacyCustomers.map(DataTransformer.transformCustomer);

      const stats = {
        total: modernCustomers.length,
        active: modernCustomers.filter(c => c.status === 'active').length,
        inactive: modernCustomers.filter(c => c.status === 'inactive').length,
        withCompany: modernCustomers.filter(c => c.company).length,
        topCities: this.getTopCities(modernCustomers),
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

  private getTopCities(customers: ModernCustomer[]) {
    const cityCount = customers.reduce((acc, customer) => {
      const city = customer.address.city;
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(cityCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([city, count]) => ({ city, count }));
  }
}