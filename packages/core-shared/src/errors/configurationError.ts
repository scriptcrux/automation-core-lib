export class ConfigurationError extends Error {
  constructor(message: string) {
    super(`[CONFIGURATION EXCEPTION] ${message}`);
    this.name = 'ConfigurationError';
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}
