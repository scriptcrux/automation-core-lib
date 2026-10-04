export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly driver?: string
  ) {
    super(`[DATABASE EXCEPTION${driver ? ` - ${driver}` : ''}] ${message}`);
    this.name = 'DatabaseError';
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
