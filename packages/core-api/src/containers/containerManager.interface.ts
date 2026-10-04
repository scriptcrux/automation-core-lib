export interface IContainerInstance {
  getHost(): string;
  getPort(): number;
  getConnectionUri(): string;
  stop(): Promise<void>;
  isFallback(): boolean;
}

export interface PostgresContainerOptions {
  image?: string;
  database?: string;
  username?: string;
  password?: string;
  startupTimeoutMs?: number;
}

export interface RedisContainerOptions {
  image?: string;
  port?: number;
  startupTimeoutMs?: number;
}
