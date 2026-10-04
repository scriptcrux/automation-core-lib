import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { setupInterceptors } from './interceptors/retry-interceptor.js';
import { ILogger, defaultLogger } from '@script-crux/core-shared';

// Environment configuration blueprint mapping options explicitly
export interface HttpClientEnvConfig {
  baseUrl: string;
  apiTimeout?: number;
  maxRetries?: number;
  retryDelayMs?: number;
}

export abstract class BaseAxiosClient {
  protected instance: AxiosInstance;

  constructor(envConfig: HttpClientEnvConfig, logger: ILogger = defaultLogger, customConfig?: AxiosRequestConfig) {
    this.instance = axios.create({
      baseURL: envConfig.baseUrl,
      timeout: envConfig.apiTimeout || 5000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      ...customConfig
    });

    // Initialize interceptors with clear environmental rules and chosen logger
    setupInterceptors(this.instance, {
      maxRetries: envConfig.maxRetries ?? 2,
      retryDelayMs: envConfig.retryDelayMs ?? 1000,
      logger: logger
    });
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  protected async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  protected async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}
