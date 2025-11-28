import { cacheService } from '../src/utils/cache';

beforeEach(() => {
  // Clear cache before each test
  cacheService.flush();
});

afterAll(() => {
  // Clean up after all tests
  cacheService.flush();
});