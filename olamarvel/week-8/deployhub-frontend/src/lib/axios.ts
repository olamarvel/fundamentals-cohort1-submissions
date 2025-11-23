import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios';
import Cookies from 'js-cookie';
import { refreshAccessToken } from '@/services/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

let isRefreshing = false;

interface FailedRequest {
  // resolve MUST accept an AxiosResponse (not optional)
  resolve: (value: AxiosResponse) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig & { _retry?: boolean };
}

let failedQueue: FailedRequest[] = [];

const addAuthHeader = (
  config: AxiosRequestConfig,
  token: string
): AxiosRequestConfig => {
  const headers = (config.headers as Record<string, any>) || {};
  // preserve existing headers and add Authorization
  config.headers = { ...headers, Authorization: `Bearer ${token}` };
  return config;
};

const processQueue = async (error: Error | null, token: string | null = null): Promise<void> => {
  while (failedQueue.length) {
    const req = failedQueue.shift()!;
    if (error) {
      req.reject(error);
      continue;
    }
    if (!token) {
      req.reject(new Error('No token to retry request with'));
      continue;
    }

    try {
      const retryConfig = addAuthHeader(req.config, token);
      const res = await instance.request(retryConfig);
      req.resolve(res);
    } catch (err) {
      req.reject(err);
    }
  }
};

instance.interceptors.response.use(
  (response) => response,
  async (err: AxiosError | unknown) => {
    const error = err as AxiosError;
    const originalRequest = (error.config || {}) as AxiosRequestConfig & { _retry?: boolean };
    const accessTokenCookieName = 'token';

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/api/auth/refresh'
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken(); // assume returns string | null

        if (newAccessToken) {
          // attach header to the original request and to queued requests
          originalRequest.headers = {
            ...(originalRequest.headers as Record<string, any>),
            Authorization: `Bearer ${newAccessToken}`,
          };
          await processQueue(null, newAccessToken);
          return instance.request(originalRequest);
        } else {
          await processQueue(new Error('Refresh token invalid or expired'), null);
          Cookies.remove(accessTokenCookieName);
          window.location.href = '/login';
          return Promise.reject(new Error('Session expired. Please log in again.'));
        }
      } catch (refreshError) {
        const e = refreshError instanceof Error ? refreshError : new Error(String(refreshError));
        await processQueue(e, null);
        Cookies.remove(accessTokenCookieName);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
