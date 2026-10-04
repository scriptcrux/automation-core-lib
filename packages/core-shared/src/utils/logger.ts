import { ILogger } from '../types/common.types.js';

export class TestLogger implements ILogger {
  static info(message: string): void {
    console.log(`[INFO] [${new Date().toISOString()}]: ${message}`);
  }

  static error(message: string): void {
    console.error(`[ERROR] [${new Date().toISOString()}]: ${message}`);
  }

  static warn(message: string): void {
    console.warn(`[WARN] [${new Date().toISOString()}]: ${message}`);
  }

  info(message: string): void {
    TestLogger.info(message);
  }

  warn(message: string): void {
    TestLogger.warn(message);
  }

  error(message: string): void {
    TestLogger.error(message);
  }
}

export const defaultLogger: ILogger = new TestLogger();
