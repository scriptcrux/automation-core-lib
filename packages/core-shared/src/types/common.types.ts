export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface ILogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
}
