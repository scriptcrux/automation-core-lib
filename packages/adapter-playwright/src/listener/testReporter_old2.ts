// packages/adapter-playwright/src/listener/testReporter.ts
import type { Reporter, TestCase, TestResult, FullConfig, Suite, FullResult } from '@playwright/test/reporter';
import { ConfigManager, TestLogger } from '@script-crux/core-shared';
import RPReporter from '@reportportal/agent-js-playwright';

type RPReporterInstance = {
  onBegin?: (config: FullConfig, suite: Suite) => void;
  onTestBegin?: (test: TestCase) => void;
  onTestEnd?: (test: TestCase, result: TestResult) => void;
  onEnd?: (result: FullResult) => Promise<void> | void;
  onStdOut?: (chunk: string | Buffer, test?: TestCase, result?: TestResult) => void;
  onStdErr?: (chunk: string | Buffer, test?: TestCase, result?: TestResult) => void;
};

export default class CustomTestReporter implements Reporter {
  private rpReporterInstance?: RPReporterInstance;
  private readonly isRpEnabled: boolean;

  constructor() {
    const rpConfig = ConfigManager.getReportPortalConfig();
    this.isRpEnabled = rpConfig.enabled;

    if (!this.isRpEnabled) {
      return;
    }

    // packages/adapter-playwright/src/listener/testReporter.ts

    // ... inside your CustomTestReporter constructor() ...
    try {
      this.rpReporterInstance = new RPReporter({
        apiKey: rpConfig.apiKey,
        endpoint: rpConfig.endpoint,
        project: rpConfig.project,
        launch: rpConfig.launchName,
        attributes: rpConfig.attributes,
        description: rpConfig.description,
        // ◀️ CRITICAL: ReportPortal configuration attributes must be nested inside agentConfig
        // includeTestSteps: rpConfig.includeTestSteps, // ◀️ Pass flat at root level
        includeTestSteps: true, // ◀️ Pass flat at root level
        uploadTrace: rpConfig.uploadTrace,           // ◀️ Pass flat at root level
      }) as RPReporterInstance;

      TestLogger.info(`[ReportPortal] Initialized for project: ${rpConfig.project}`);
    } catch (error) {
      console.error(`[ReportPortal] Initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }


    // try {
    //   this.rpReporterInstance = new RPReporter({
    //     apiKey: rpConfig.apiKey,
    //     endpoint: rpConfig.endpoint,
    //     project: rpConfig.project,
    //     launch: rpConfig.launchName,
    //     attributes: rpConfig.attributes,
    //     description: rpConfig.description,
    //     includeTestSteps: true
    //   }) as RPReporterInstance;

    //   TestLogger.info(`[ReportPortal] Initialized for project: ${rpConfig.project}`);
    // } catch (error) {
    //   console.error(`[ReportPortal] Initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    // }
  }

  // ◀️ CAPTURE AND FORWARD INTERCEPTED WORKER CONSOLE LOGS HERE
  onStdOut(chunk: string | Buffer, test?: TestCase, result?: TestResult): void {
    if (this.isRpEnabled && this.rpReporterInstance?.onStdOut) {
      this.rpReporterInstance.onStdOut(chunk, test, result);
    }
  }

  onStdErr(chunk: string | Buffer, test?: TestCase, result?: TestResult): void {
    if (this.isRpEnabled && this.rpReporterInstance?.onStdErr) {
      this.rpReporterInstance.onStdErr(chunk, test, result);
    }
  }

  onBegin(config: FullConfig, suite: Suite): void {
    this.rpReporterInstance?.onBegin?.(config, suite);
  }

  onTestBegin(test: TestCase): void {
    this.rpReporterInstance?.onTestBegin?.(test);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status === 'failed' && result.error) {
      console.error(`[TEST ERROR]: ${result.error.message}`);
    }
    this.rpReporterInstance?.onTestEnd?.(test, result);
  }

  async onEnd(result: FullResult): Promise<void> {
    try {
      await this.rpReporterInstance?.onEnd?.(result);
    } catch (error) {
      console.error(`[ReportPortal] Finalization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  printsToStdio(): boolean {
    // Return true so logs still print locally in your VS Code terminal window!
    return true;
  }
}
