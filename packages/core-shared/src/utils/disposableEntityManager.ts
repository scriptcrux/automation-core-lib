import { TestLogger } from './logger.js';

export type CleanupHandler<T = any> = (entity: T) => Promise<void> | void;

export interface RegisteredEntity<T = any> {
  type: string;
  idOrPayload: T;
  cleanupHandler: CleanupHandler<T>;
  registeredAt: number;
}

export class DisposableEntityManager {
  private registry: RegisteredEntity[] = [];

  /**
   * Registers a created entity (ID, object, etc.) along with its cleanup teardown action.
   */
  public register<T>(type: string, idOrPayload: T, cleanupHandler: CleanupHandler<T>): T {
    const entry: RegisteredEntity<T> = {
      type,
      idOrPayload,
      cleanupHandler,
      registeredAt: Date.now()
    };
    this.registry.push(entry);
    TestLogger.info(
      `[DISPOSABLE] Registered entity [${type}] with ID/Payload: [${typeof idOrPayload === 'object' ? JSON.stringify(idOrPayload) : String(idOrPayload)}] for lifecycle cleanup`
    );
    return idOrPayload;
  }

  /**
   * Registers an arbitrary cleanup callback.
   */
  public registerCallback(description: string, callback: () => Promise<void> | void): void {
    this.register(description, null, callback);
  }

  /**
   * Executes all registered cleanup actions in LIFO order (last created -> first cleaned).
   * Ensures that errors in individual cleanups are logged without aborting remaining cleanups.
   */
  public async cleanupAll(): Promise<void> {
    if (this.registry.length === 0) {
      return;
    }

    TestLogger.info(`[DISPOSABLE] Executing lifecycle cleanup for ${this.registry.length} registered entities...`);
    const errors: Array<{ type: string; error: Error }> = [];

    // LIFO Execution
    while (this.registry.length > 0) {
      const item = this.registry.pop();
      if (!item) break;

      try {
        TestLogger.info(`[DISPOSABLE] Cleaning up entity [${item.type}]...`);
        await item.cleanupHandler(item.idOrPayload);
        TestLogger.info(`[DISPOSABLE] Successfully cleaned up entity [${item.type}]`);
      } catch (err: any) {
        TestLogger.error(`[DISPOSABLE ERROR] Failed to clean up entity [${item.type}]: ${err.message}`);
        errors.push({ type: item.type, error: err });
      }
    }

    if (errors.length > 0) {
      TestLogger.warn(`[DISPOSABLE] Teardown finished with ${errors.length} non-fatal cleanup warning(s).`);
    } else {
      TestLogger.info('[DISPOSABLE] All test entities disposed successfully.');
    }
  }

  /**
   * Returns current count of registered entities pending cleanup
   */
  public getPendingCount(): number {
    return this.registry.length;
  }

  /**
   * Clears registration without running cleanup handlers
   */
  public clear(): void {
    this.registry = [];
  }
}
