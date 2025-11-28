import { config } from '../config';
import { RetryConfig } from '../types';

export class RetryService {
  private retryConfig: RetryConfig;

  constructor(retryConfig: RetryConfig = config.retry) {
    this.retryConfig = retryConfig;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    customConfig?: Partial<RetryConfig>
  ): Promise<T> {
    const { maxRetries, baseDelay, maxDelay } = { ...this.retryConfig, ...customConfig };
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const retryService = new RetryService();