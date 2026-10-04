import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    retryCount?: number;
    skipRetry?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    retryCount?: number;
    skipRetry?: boolean;
  }
}
