import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { randomUUID } from 'node:crypto';
import { ILogger } from '../logging/logger.interface.js';

export interface TelemetryOptions {
  logger: ILogger;
  defaultSlaThresholdMs?: number;
  enableTracing?: boolean;
}

export function setupTelemetryInterceptor(instance: AxiosInstance, options: TelemetryOptions): void {
  const { logger, defaultSlaThresholdMs = 1500, enableTracing = true } = options;

  if (!enableTracing) {
    return;
  }

  // Request Interceptor: Inject Tracing Headers and Timestamp
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const existingCorrId =
      config.correlationId ||
      (config.headers?.['x-correlation-id'] as string) ||
      (config.headers?.['X-Correlation-Id'] as string);

    const correlationId = existingCorrId || randomUUID();
    const requestId = config.requestId || randomUUID();
    const startTime = Date.now();

    config.metadata = {
      startTime,
      correlationId,
      requestId
    };

    config.headers.set('X-Correlation-Id', correlationId);
    config.headers.set('X-Request-Id', requestId);

    logger.info(
      `[TRACE OUTBOUND] HTTP ${config.method?.toUpperCase()} -> ${config.url} [Trace: ${correlationId.slice(0, 8)} | Req: ${requestId.slice(0, 8)}]`
    );

    return config;
  });

  // Response Interceptor: Record Duration & Check SLA
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config;
      const metadata = config.metadata;
      const startTime = metadata?.startTime || Date.now();
      const durationMs = Date.now() - startTime;
      const correlationId = metadata?.correlationId || (response.headers['x-correlation-id'] as string) || 'N/A';
      const requestId = metadata?.requestId || 'N/A';

      const telemetry = {
        startTime,
        durationMs,
        correlationId,
        requestId
      };

      response.telemetry = telemetry;

      const method = config.method?.toUpperCase() || 'UNKNOWN';
      const url = config.url || '';
      const threshold = config.slaThresholdMs ?? defaultSlaThresholdMs;

      logger.info(
        `[PERF SUCCESS] HTTP ${method} ${url} -> ${response.status} in ${durationMs}ms [Trace: ${correlationId.slice(0, 8)}]`
      );

      if (durationMs > threshold) {
        logger.warn(
          `[SLA BREACH] HTTP ${method} ${url} took ${durationMs}ms (exceeded SLA threshold limit of ${threshold}ms)`
        );
      }

      return response;
    },
    (error) => {
      if (error.config?.metadata?.startTime) {
        const durationMs = Date.now() - error.config.metadata.startTime;
        const method = error.config.method?.toUpperCase() || 'UNKNOWN';
        const url = error.config.url || '';
        const corrId = error.config.metadata.correlationId || 'N/A';
        logger.error(
          `[PERF ERROR] HTTP ${method} ${url} failed after ${durationMs}ms [Trace: ${corrId.slice(0, 8)}] - ${error.message}`
        );
      }
      return Promise.reject(error);
    }
  );
}
