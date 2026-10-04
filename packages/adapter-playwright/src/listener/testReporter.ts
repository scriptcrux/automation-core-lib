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
        includeTestSteps: true // 🌟 Tells the agent to monitor test.step tracking
      });
      TestLogger.info(`[ReportPortal] Initialized for project: ${rpConfig.project}`);
    } catch (error) {
      console.error(`[ReportPortal] Initialization failed: ${error}`);
    }
  }

  // Pass everything through to the raw agent cleanly
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

  onTestEnd(test: TestCase, result: TestResult): void {
    if (this.isRpEnabled && this.rpReporterInstance) {

      // 🌟 Manual Attachment Routing Fallback
      if (result.status !== 'passed' && result.attachments) {
        const videoAttachment = result.attachments.find(att => att.contentType?.includes('video'));

        if (videoAttachment && videoAttachment.path) {
          try {
            const fs = require('fs');
            const videoBuffer = fs.readFileSync(videoAttachment.path);

            // Push raw video stream directly to ReportPortal logs
            this.rpReporterInstance.onStdOut?.(
              videoBuffer,
              test,
              result
            );
          } catch (err) {
            console.error('[ReportPortal Logger] Failed to attach video buffer:', err);
          }
        }
      }

      // Forward native execution complete hook
      this.rpReporterInstance?.onTestEnd?.(test, result);
    }
  }


  onEnd(result: FullResult): Promise<void> | void {
    if (this.isRpEnabled) return this.rpReporterInstance?.onEnd?.(result);
  }
}
