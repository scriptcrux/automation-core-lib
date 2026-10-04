import { TestLogger } from '@script-crux/core-shared';
import { IContainerInstance, RedisContainerOptions } from './containerManager.interface.js';
import { DockerDetector } from './dockerDetector.js';

class FallbackRedisContainer implements IContainerInstance {
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
    TestLogger.info('[TESTCONTAINERS] Stopped fallback Redis instance.');
  }

  isFallback(): boolean {
    return true;
  }
}

class LiveRedisContainer implements IContainerInstance {
  constructor(
    private readonly startedContainer: any,
    private readonly uri: string
  ) {}

  getHost(): string {
    return this.startedContainer.getHost();
  }

  getPort(): number {
    return this.startedContainer.getMappedPort(6379);
  }

  getConnectionUri(): string {
    return this.uri;
  }

  async stop(): Promise<void> {
    TestLogger.info('[TESTCONTAINERS] Stopping ephemeral Redis container...');
    await this.startedContainer.stop();
    TestLogger.info('[TESTCONTAINERS] Ephemeral Redis container stopped.');
  }

  isFallback(): boolean {
    return false;
  }
}

export class RedisContainerManager {
  /**
   * Boots an ephemeral Redis container or graceful fallback simulation.
   */
  public static async start(options: RedisContainerOptions = {}): Promise<IContainerInstance> {
    const isDocker = await DockerDetector.isDockerAvailable();

    if (!isDocker) {
      TestLogger.info('[TESTCONTAINERS] Operating in lightweight fallback mode for Redis.');
      const fallbackHost = '127.0.0.1';
      const fallbackPort = 6379;
      return new FallbackRedisContainer(fallbackHost, fallbackPort, `redis://${fallbackHost}:${fallbackPort}`);
    }

    try {
      TestLogger.info('[TESTCONTAINERS] Starting real ephemeral Redis container via Testcontainers...');
      const { GenericContainer } = await import('testcontainers');

      const container = new GenericContainer(options.image || 'redis:7-alpine').withExposedPorts(6379);

      const started = await container.start();
      const host = started.getHost();
      const port = started.getMappedPort(6379);
      const uri = `redis://${host}:${port}`;

      TestLogger.info(`[TESTCONTAINERS] Redis Container started on ${host}:${port}`);
      return new LiveRedisContainer(started, uri);
    } catch (err: any) {
      TestLogger.warn(`[TESTCONTAINERS] Could not start Docker container: ${err.message}. Using simulated connection.`);
      return new FallbackRedisContainer('127.0.0.1', 6379, 'redis://127.0.0.1:6379');
    }
  }
}
