import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { TestLogger } from '@script-crux/core-shared';

const execAsync = promisify(exec);

export class DockerDetector {
  private static cachedResult: boolean | null = null;

  /**
   * Checks if a responsive Docker daemon is running on the host system.
   */
  public static async isDockerAvailable(timeoutMs = 2500): Promise<boolean> {
    if (this.cachedResult !== null) {
      return this.cachedResult;
    }

    try {
      const promise = execAsync('docker info');
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Docker check timeout')), timeoutMs)
      );

      await Promise.race([promise, timeout]);
      this.cachedResult = true;
      TestLogger.info('[CONTAINERS] Docker daemon detected and available.');
      return true;
    } catch {
      this.cachedResult = false;
      TestLogger.warn('[CONTAINERS] Docker daemon is not running. Using fallback in-memory database simulation.');
      return false;
    }
  }

  /**
   * Resets cached detection state (useful for testing)
   */
  public static resetCache(): void {
    this.cachedResult = null;
  }
}
