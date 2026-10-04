import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { FrameworkApiError } from '../errors/framework-error';
import { ILogger } from '../logging/logger.interface';

interface RetryOptions {
    maxRetries: number;
    retryDelayMs: number;
    logger: ILogger;
}

function normalizeError(error: AxiosError): FrameworkApiError {
    const status = error.response ? error.response.status : 'NETWORK_TIMEOUT';
    return new FrameworkApiError(
        error.message || 'An unexpected API error occurred',
        status,
        error.code
    );
}

export function setupInterceptors(instance: AxiosInstance, options: RetryOptions): void {
    const { maxRetries, retryDelayMs, logger } = options;

    // Outbound Transport Logger
    instance.interceptors.request.use((req) => {
        logger.info(`[TRANSPORT] Outbound HTTP ${req.method?.toUpperCase()} -> ${req.url}`);
        return req;
    });

    // Inbound Response & Retry Logic
    instance.interceptors.response.use(
        (res: AxiosResponse) => {
            logger.info(`[TRANSPORT] HTTP ${res.config.method?.toUpperCase()} Success Code: ${res.status}`);
            return res;
        },
        async (error: AxiosError) => {
            const originalRequest = error.config;

            if (!originalRequest) {
                return Promise.reject(normalizeError(error));
            }

            const status = error.response ? error.response.status : 'NETWORK_TIMEOUT';
            originalRequest.retryCount = originalRequest.retryCount ?? 0;

            const isRetryableStatus = status === 'NETWORK_TIMEOUT' || (typeof status === 'number' && status >= 500);
            const isSafeMethod = ['GET', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'].includes(originalRequest.method?.toUpperCase() || '');
            const complexRetryAllowed = isRetryableStatus && isSafeMethod && !originalRequest.skipRetry;

            if (originalRequest.retryCount < maxRetries && complexRetryAllowed) {
                originalRequest.retryCount += 1;

                logger.warn(
                    `[RETRY] Request failed (${status}). Attempt ${originalRequest.retryCount} of ${maxRetries}...`
                );

                await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
                return instance(originalRequest);
            }

            logger.error(`[EXCEPTION] Request failed on Status: ${status} - ${error.message}`);
            return Promise.reject(normalizeError(error));
        }
    );
}
