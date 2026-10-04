// packages/adapter-playwright/src/listener/testReporter.ts
import type { Reporter, TestCase, TestResult, FullConfig, Suite, FullResult } from '@playwright/test/reporter';
import { ConfigManager, TestLogger } from '@script-crux/core-shared';
import RPReporter, { ReportingApi } from '@reportportal/agent-js-playwright'; // ◀️ Safely use ReportingApi here

type RPReporterInstance = {
  onBegin?: (config: FullConfig, suite: Suite) => void;
  onTestBegin?: (test: TestCase) => void;
  onTestEnd?: (test: TestCase, result: TestResult) => void;
  onEnd?: (result: FullResult) => Promise<void> | void;
};

export default class CustomTestReporter implements Reporter {
  private rpReporterInstance?: RPReporterInstance;
  private readonly isRpEnabled: boolean;

  constructor() {
    const rpConfig = ConfigManager.getReportPortalConfig();
    this.isRpEnabled = rpConfig.enabled;

    if (!this.isRpEnabled) {
      TestLogger.info('[ReportPortal] Disabled for this run.');
      return;
    }

    try {
      this.rpReporterInstance = new RPReporter({
        apiKey: rpConfig.apiKey,
        endpoint: rpConfig.endpoint,
        project: rpConfig.project,
        launch: rpConfig.launchName,
        attributes: rpConfig.attributes,
        description: rpConfig.description,
        includeTestSteps: true
      }) as RPReporterInstance;

      TestLogger.info(`[ReportPortal] Initialized for project: ${rpConfig.project}`);
    } catch (error) {
      TestLogger.error(`[ReportPortal] Initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // ◀️ INTERCEPT THE WORKER LOGS NATIVELY HERE
  onMessage(message: any): void {
    if (this.isRpEnabled && message?.event === 'CORE_LOG_EMITTED') {
      const { level, message: logText } = message;
      
      // Send the log string directly to ReportPortal's Master Process thread
      if (level === 'INFO') ReportingApi.info(logText);
      else if (level === 'ERROR') ReportingApi.error(logText);
      else if (level === 'WARN') ReportingApi.warn(logText);
    }
  }

  onBegin(config: FullConfig, suite: Suite): void {
    this.rpReporterInstance?.onBegin?.(config, suite);
  }

  onTestBegin(test: TestCase): void {
    TestLogger.info(`▶ [TEST STARTED]: ${test.title}`);
    this.rpReporterInstance?.onTestBegin?.(test);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const statusIcon = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⚠️';
    TestLogger.info(`${statusIcon} [TEST FINISHED]: ${test.title} -> ${result.status.toUpperCase()}`);

    if (result.status === 'failed' && result.error) {
      TestLogger.error(`[TEST ERROR]: ${result.error.message}`);
    }

    this.rpReporterInstance?.onTestEnd?.(test, result);
  }

  async onEnd(result: FullResult): Promise<void> {
    try {
      TestLogger.info('[ReportPortal] Finalizing upload...');
      await this.rpReporterInstance?.onEnd?.(result);
    } catch (error) {
      TestLogger.error(`[ReportPortal] Finalization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  printsToStdio(): boolean { return true; }
}
