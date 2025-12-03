import { legacyApiService } from '../src/services/legacy-api.service';
import { cacheService } from '../src/services/cache.service';
import axios from 'axios';

jest.mock('axios');
jest.mock('../src/services/cache.service');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LegacyApiService', () => {
  let mockAxiosInstance: {
    get: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cacheService.get as jest.Mock).mockReturnValue(undefined);
    (cacheService.set as jest.Mock).mockReturnValue(true);

    mockAxiosInstance = {
      get: jest.fn(),
    };

    mockedAxios.create = jest.fn(() => mockAxiosInstance as any);
  });

  describe('getUsers', () => {
    it('should fetch users from legacy API', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', username: 'johndoe', email: 'john@example.com' },
      ];

      mockAxiosInstance.get.mockResolvedValue({ data: mockUsers });

      const result = await legacyApiService.getUsers();

      expect(result).toEqual(mockUsers);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users');
    });

    it('should return cached users if available', async () => {
      const cachedUsers = [{ id: 1, name: 'Cached User' }];
      (cacheService.get as jest.Mock).mockReturnValue(cachedUsers);

      const result = await legacyApiService.getUsers();

      expect(result).toEqual(cachedUsers);
      expect(cacheService.get).toHaveBeenCalled();
      expect(mockAxiosInstance.get).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should fetch a single user by ID', async () => {
      const mockUser = { id: 1, name: 'John Doe' };

      mockAxiosInstance.get.mockResolvedValue({ data: mockUser });

      const result = await legacyApiService.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/1');
    });
  });
});

