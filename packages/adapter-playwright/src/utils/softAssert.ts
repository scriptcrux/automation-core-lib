import { TestLogger } from '@script-crux/core-shared';

export interface SoftAssertionFailure {
  description: string;
  expected: unknown;
  actual: unknown;
  error?: Error;
}

export class SoftAssert {
  private failures: SoftAssertionFailure[] = [];

  /**
   * Asserts that a condition is true without throwing an immediate error.
   */
  public assertTrue(condition: boolean, message: string): void {
    if (!condition) {
      this.recordFailure(message, true, condition);
    } else {
      TestLogger.info(`[SOFT ASSERT PASS] ${message}`);
    }
  }

  /**
   * Asserts that actual equals expected without throwing immediately.
   */
  public assertEqual<T>(actual: T, expected: T, message: string): void {
    if (actual !== expected) {
      this.recordFailure(`${message} - Expected: [${expected}], Got: [${actual}]`, expected, actual);
    } else {
      TestLogger.info(`[SOFT ASSERT PASS] ${message} (Value: ${actual})`);
    }
  }

  /**
   * Asserts that a string contains a substring.
   */
  public assertContains(actual: string, substring: string, message: string): void {
    if (!actual || !actual.includes(substring)) {
      this.recordFailure(`${message} - Expected [${actual}] to contain [${substring}]`, substring, actual);
    } else {
      TestLogger.info(`[SOFT ASSERT PASS] ${message}`);
    }
  }

  private recordFailure(description: string, expected: unknown, actual: unknown): void {
    const failure: SoftAssertionFailure = {
      description,
      expected,
      actual,
      error: new Error(description)
    };
    this.failures.push(failure);
    TestLogger.error(`[SOFT ASSERT FAIL] ${description}`);
  }

  /**
   * Checks if any assertions failed and throws an aggregated error if so.
   */
  public assertAll(): void {
    if (this.failures.length === 0) {
      TestLogger.info('[SOFT ASSERT] All soft assertions passed successfully.');
      return;
    }

    const summary = this.failures.map((f, idx) => `  ${idx + 1}) ${f.description}`).join('\n');

    const total = this.failures.length;
    this.failures = []; // reset after asserting

    throw new Error(`Soft Assertion Failures (${total} failure(s)):\n${summary}`);
  }

  public getFailureCount(): number {
    return this.failures.length;
  }
}
