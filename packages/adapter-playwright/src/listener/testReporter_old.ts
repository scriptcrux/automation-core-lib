import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { TestLogger } from '@script-crux/core-shared';

export default class CustomTestReporter implements Reporter {
    onTestBegin(test: TestCase): void {
        const tags = test.tags?.length ? test.tags.join(', ') : 'none';
        TestLogger.info(`▶ [TEST STARTED] ${test.title} [Tags: ${tags}]`);
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        const statusIcon =
            result.status === 'passed' ? '✅' :
                result.status === 'failed' ? '❌' : '⚠️';

        TestLogger.info(`${statusIcon} [TEST FINISHED] ${test.title} -> ${result.status.toUpperCase()}`);

        if (result.status === 'failed' && result.error) {
            TestLogger.error(`Failure message: ${result.error.message}`);
        }
    }

    printsToStdio(): boolean {
        return false;
    }
}