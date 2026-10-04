// packages/adapter-axios/src/index.ts

export { BaseAxiosClient } from './base-client.js';
export type { HttpClientEnvConfig } from './base-client.js';
export { FrameworkApiError, ContractValidationError } from './errors/framework-error.js';
export type { ILogger } from './logging/logger.interface.js';
export type { RequestTelemetryMetadata } from './types/axios-retry.d.js';
export { setupTelemetryInterceptor } from './interceptors/telemetry-interceptor.js';
export type { TelemetryOptions } from './interceptors/telemetry-interceptor.js';
