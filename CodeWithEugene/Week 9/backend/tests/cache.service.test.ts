import { cacheService } from '../src/services/cache.service';

describe('CacheService', () => {
  beforeEach(() => {
    cacheService.clear();
  });

  describe('get and set', () => {
    it('should store and retrieve values', () => {
      const key = 'test-key';
      const value = { data: 'test' };

      cacheService.set(key, value);
      const result = cacheService.get(key);

      expect(result).toEqual(value);
    });

    it('should return undefined for non-existent keys', () => {
      const result = cacheService.get('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('has', () => {
    it('should return true for existing keys', () => {
      cacheService.set('test', 'value');
      expect(cacheService.has('test')).toBe(true);
    });

    it('should return false for non-existent keys', () => {
      expect(cacheService.has('non-existent')).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete a key', () => {
      cacheService.set('test', 'value');
      cacheService.delete('test');
      expect(cacheService.has('test')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all keys', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');
      cacheService.clear();

      expect(cacheService.has('key1')).toBe(false);
      expect(cacheService.has('key2')).toBe(false);
    });
  });
});


