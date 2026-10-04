import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { setupInterceptors } from './interceptors/retry-interceptor.js';
import { setupTelemetryInterceptor } from './interceptors/telemetry-interceptor.js';
import { ContractValidationError } from './errors/framework-error.js';
import { RequestTelemetryMetadata } from './types/axios-retry.d.js';
import { ILogger, defaultLogger } from '@script-crux/core-shared';

// Environment configuration blueprint mapping options explicitly
export interface HttpClientEnvConfig {
  baseUrl: string;
  apiTimeout?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  enableTracing?: boolean;
  defaultSlaThresholdMs?: number;
}

export abstract class BaseAxiosClient {
  protected instance: AxiosInstance;
  protected lastTelemetry?: RequestTelemetryMetadata;

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

    // 1. Setup Distributed Tracing & SLA Profiling
    setupTelemetryInterceptor(this.instance, {
      logger,
      defaultSlaThresholdMs: envConfig.defaultSlaThresholdMs ?? 2000,
      enableTracing: envConfig.enableTracing ?? true
    });

    // 2. Setup Retry & Error Normalization Interceptors
    setupInterceptors(this.instance, {
      maxRetries: envConfig.maxRetries ?? 2,
      retryDelayMs: envConfig.retryDelayMs ?? 1000,
      logger: logger
    });
  }

  /**
   * Retrieves the telemetry metadata (correlation ID, duration, etc.) of the most recent response
   */
  public getLastTelemetry(): RequestTelemetryMetadata | undefined {
    return this.lastTelemetry;
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    this.lastTelemetry = response.telemetry;
    return response.data;
  }

  protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    this.lastTelemetry = response.telemetry;
    return response.data;
  }

  protected async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    this.lastTelemetry = response.telemetry;
    return response.data;
  }

  protected async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    this.lastTelemetry = response.telemetry;
    return response.data;
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    this.lastTelemetry = response.telemetry;
    return response.data;
  }

  /**
   * Performs a GET request and runs a runtime schema/contract validator against the payload.
   * Throws a ContractValidationError if schema assertions fail.
   */
  protected async getAndValidate<T>(
    url: string,
    validator: (data: unknown) => T,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const data = await this.get<unknown>(url, config);
    try {
      return validator(data);
    } catch (err: any) {
      throw new ContractValidationError(`Contract validation failed for GET ${url}: ${err.message || err}`, data, err);
    }
  }

  /**
   * Performs a POST request and runs a runtime schema/contract validator against the response.
   */
  protected async postAndValidate<T>(
    url: string,
    payload: unknown,
    validator: (data: unknown) => T,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const data = await this.post<unknown>(url, payload, config);
    try {
      return validator(data);
    } catch (err: any) {
      throw new ContractValidationError(`Contract validation failed for POST ${url}: ${err.message || err}`, data, err);
    }
  }

  /**
   * Low-level raw response access (includes full headers, status code, and telemetry)
   */
  protected async getRaw<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await this.instance.get<T>(url, config);
    this.lastTelemetry = response.telemetry;
    return response;
  }

  protected async postRaw<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const response = await this.instance.post<T>(url, data, config);
    this.lastTelemetry = response.telemetry;
    return response;
  }
}
