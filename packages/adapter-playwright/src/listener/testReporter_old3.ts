// packages/adapter-playwright/src/listener/testReporter.ts
import type { Reporter, TestCase, TestResult, FullConfig, Suite, FullResult } from '@playwright/test/reporter';
import { ConfigManager, TestLogger } from '@script-crux/core-shared';
import RPReporter from '@reportportal/agent-js-playwright';

export default class CustomTestReporter implements Reporter {
  private rpReporterInstance?: any; 
  private readonly isRpEnabled: boolean;

  constructor() {
    const rpConfig = ConfigManager.getReportPortalConfig();
    this.isRpEnabled = rpConfig.enabled;

    if (!this.isRpEnabled) return;

    try {
      this.rpReporterInstance = new RPReporter({
        apiKey: rpConfig.apiKey,
        endpoint: rpConfig.endpoint,
        project: rpConfig.project,
        launch: rpConfig.launchName, 
        attributes: rpConfig.attributes,
        description: rpConfig.description,
        includeTestSteps: true
      });
      TestLogger.info(`[ReportPortal] Initialized for project: ${rpConfig.project}`);
    } catch (error) {
      console.error(`[ReportPortal] Initialization failed: ${error}`);
    }
  }

  onStepBegin(test: TestCase, result: TestResult, step: any): void {
    if (this.isRpEnabled) this.rpReporterInstance?.onStepBegin?.(test, result, step);
  }

  onStepEnd(test: TestCase, result: TestResult, step: any): void {
    if (this.isRpEnabled) this.rpReporterInstance?.onStepEnd?.(test, result, step);
  }

  onBegin(config: FullConfig, suite: Suite): void {
    if (this.isRpEnabled) this.rpReporterInstance?.onBegin?.(config, suite);
  }

  onTestBegin(test: TestCase, result: TestResult): void {
    if (this.isRpEnabled) this.rpReporterInstance?.onTestBegin?.(test, result);
  }

  // 🌟 FIX: Intercept the end of the test to move screenshots inside the failing step block
  onTestEnd(test: TestCase, result: TestResult): void {
    if (!this.isRpEnabled || !this.rpReporterInstance) return;

    // Look for any automated failure screenshots Playwright took
    const screenshots = result.attachments.filter(att => att.contentType === 'image/png');

    if (screenshots.length > 0 && result.status !== 'passed') {
      // Find the specific step object that threw the error
      const failedStep = result.steps.find(step => step.error);

      if (failedStep) {
        // Force the screenshot to link with the nested failed step ID
        screenshots.forEach(screenshot => {
          // Send it directly through the agent context stream mapped to this step 
          this.rpReporterInstance.onStdOut?.(
            screenshot.body, 
            test, 
            { ...result, steps: [failedStep] } // Scopes attachment directly to the failed step block
          );
        });
      }
    }

    // Call the original finish reporter logic cleanly
    this.rpReporterInstance?.onTestEnd?.(test, result);
  }

  onEnd(result: FullResult): Promise<void> | void {
    if (this.isRpEnabled) return this.rpReporterInstance?.onEnd?.(result);
  }
}
