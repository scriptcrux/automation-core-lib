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
