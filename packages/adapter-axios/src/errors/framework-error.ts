export class FrameworkApiError extends Error {
  public status?: number | string;
  public code?: string;

  constructor(message: string, status?: number | string, code?: string) {
    super(message);
    this.name = 'FrameworkApiError';
    this.status = status;
    this.code = code;
  }
}

export class ContractValidationError extends Error {
  public receivedData: unknown;
  public validationErrors?: unknown;

  constructor(message: string, receivedData: unknown, validationErrors?: unknown) {
    super(message);
    this.name = 'ContractValidationError';
    this.receivedData = receivedData;
    this.validationErrors = validationErrors;
  }
}
