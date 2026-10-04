import 'axios';

export interface RequestTelemetryMetadata {
  startTime?: number;
  durationMs?: number;
  correlationId?: string;
  requestId?: string;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    retryCount?: number;
    skipRetry?: boolean;
    correlationId?: string;
    requestId?: string;
    slaThresholdMs?: number;
    metadata?: RequestTelemetryMetadata;
  }
  export interface InternalAxiosRequestConfig {
    retryCount?: number;
    skipRetry?: boolean;
    correlationId?: string;
    requestId?: string;
    slaThresholdMs?: number;
    metadata?: RequestTelemetryMetadata;
  }
  export interface AxiosResponse {
    telemetry?: RequestTelemetryMetadata;
  }
}
