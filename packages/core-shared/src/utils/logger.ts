// packages/core-shared/src/logger/logger.ts
type LogLevel = 'INFO' | 'ERROR' | 'WARN';

export class TestLogger {
  static info(message: string): void {
    console.log(`[INFO] [${new Date().toISOString()}]: ${message}`);
  }

  static error(message: string): void {
    console.error(`[ERROR] [${new Date().toISOString()}]: ${message}`);
  }

  static warn(message: string): void {
    console.warn(`[WARN] [${new Date().toISOString()}]: ${message}`);
  }
}
