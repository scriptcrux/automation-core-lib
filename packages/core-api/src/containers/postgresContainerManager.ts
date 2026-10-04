import { TestLogger } from '@script-crux/core-shared';
import { IContainerInstance, PostgresContainerOptions } from './containerManager.interface.js';
import { DockerDetector } from './dockerDetector.js';

class FallbackPostgresContainer implements IContainerInstance {
  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly uri: string
  ) {}

  getHost(): string {
    return this.host;
  }

  getPort(): number {
    return this.port;
  }

  getConnectionUri(): string {
    return this.uri;
  }

  async stop(): Promise<void> {
    TestLogger.info('[TESTCONTAINERS] Stopped fallback PostgreSQL instance.');
  }

  isFallback(): boolean {
    return true;
  }
}

class LivePostgresContainer implements IContainerInstance {
  constructor(
    private readonly startedContainer: any,
    private readonly uri: string
  ) {}

  getHost(): string {
    return this.startedContainer.getHost();
  }

  getPort(): number {
    return this.startedContainer.getPort();
  }

  getConnectionUri(): string {
    return this.uri;
  }

  async stop(): Promise<void> {
    TestLogger.info('[TESTCONTAINERS] Stopping ephemeral PostgreSQL container...');
    await this.startedContainer.stop();
    TestLogger.info('[TESTCONTAINERS] Ephemeral PostgreSQL container stopped.');
  }

  isFallback(): boolean {
    return false;
  }
}

export class PostgresContainerManager {
  /**
   * Boots an ephemeral PostgreSQL database container or graceful fallback simulation.
   */
  public static async start(options: PostgresContainerOptions = {}): Promise<IContainerInstance> {
    const isDocker = await DockerDetector.isDockerAvailable();

    if (!isDocker) {
      TestLogger.info('[TESTCONTAINERS] Operating in lightweight fallback mode for PostgreSQL.');
      const fallbackHost = '127.0.0.1';
      const fallbackPort = 5432;
      const fallbackUri = `postgres://${options.username || 'testuser'}:${options.password || 'testpass'}@${fallbackHost}:${fallbackPort}/${options.database || 'testdb'}`;
      return new FallbackPostgresContainer(fallbackHost, fallbackPort, fallbackUri);
    }

    try {
      TestLogger.info('[TESTCONTAINERS] Starting real ephemeral PostgreSQL container via Testcontainers...');
      const { PostgreSqlContainer } = await import('@testcontainers/postgresql');

      const container = new PostgreSqlContainer(options.image || 'postgres:16-alpine')
        .withDatabase(options.database || 'testdb')
        .withUsername(options.username || 'testuser')
        .withPassword(options.password || 'testpass');

      const started = await container.start();
      const connectionUri = started.getConnectionUri();

      TestLogger.info(`[TESTCONTAINERS] PostgreSQL Container started on ${started.getHost()}:${started.getPort()}`);
      return new LivePostgresContainer(started, connectionUri);
    } catch (err: any) {
      TestLogger.warn(
        `[TESTCONTAINERS] Could not start Docker container: ${err.message}. Falling back to simulated connection.`
      );
      const fallbackUri = `postgres://${options.username || 'testuser'}:${options.password || 'testpass'}@127.0.0.1:5432/${options.database || 'testdb'}`;
      return new FallbackPostgresContainer('127.0.0.1', 5432, fallbackUri);
    }
  }
}
