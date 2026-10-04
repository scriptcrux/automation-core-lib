import * as fs from 'node:fs';
import type { Reporter, TestCase, TestResult, FullConfig, Suite, FullResult } from '@playwright/test/reporter';
import { ConfigManager, TestLogger } from '@script-crux/core-shared';

export default class CustomTestReporter implements Reporter {
  private rpReporterInstance?: any;
  private readonly isRpEnabled: boolean;
  private rpInitPromise?: Promise<void>;

  constructor() {
    const rpConfig = ConfigManager.getReportPortalConfig();
    this.isRpEnabled = rpConfig.enabled;

    if (!this.isRpEnabled) return;

    this.rpInitPromise = (async () => {
      try {
        const rawModule = await import('@reportportal/agent-js-playwright');
        const RPReporterClass: any =
          rawModule.default?.default || rawModule.default || (rawModule as any).RPReporter || rawModule;

        this.rpReporterInstance = new RPReporterClass({
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
    })();
  }

  // Pass everything through to the raw agent cleanly
  onStepBegin(test: TestCase, result: TestResult, step: any): void {
    if (this.isRpEnabled) this.rpReporterInstance?.onStepBegin?.(test, result, step);
  }

  onStepEnd(test: TestCase, result: TestResult, step: any): void {
    if (this.isRpEnabled) this.rpReporterInstance?.onStepEnd?.(test, result, step);
  }

  async onBegin(config: FullConfig, suite: Suite): Promise<void> {
    if (this.isRpEnabled) {
      if (this.rpInitPromise) await this.rpInitPromise;
      await this.rpReporterInstance?.onBegin?.(config, suite);
    }
  }

  onTestBegin(test: TestCase, result: TestResult): void {
    if (this.isRpEnabled) this.rpReporterInstance?.onTestBegin?.(test, result);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (this.isRpEnabled && this.rpReporterInstance) {
      // 🌟 Manual Attachment Routing Fallback
      if (result.status !== 'passed' && result.attachments) {
        const videoAttachment = result.attachments.find((att) => att.contentType?.includes('video'));

        if (videoAttachment && videoAttachment.path) {
          try {
            const videoBuffer = fs.readFileSync(videoAttachment.path);

            // Push raw video stream directly to ReportPortal logs
            this.rpReporterInstance.onStdOut?.(videoBuffer, test, result);
          } catch (err) {
            console.error('[ReportPortal Logger] Failed to attach video buffer:', err);
          }
        }
      }

      // Forward native execution complete hook
      this.rpReporterInstance?.onTestEnd?.(test, result);
    }
  }

  async onEnd(result: FullResult): Promise<void> {
    if (this.isRpEnabled) {
      if (this.rpInitPromise) await this.rpInitPromise;
      await this.rpReporterInstance?.onEnd?.(result);
    }
  }
}
