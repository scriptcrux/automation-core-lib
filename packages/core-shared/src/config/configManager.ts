import { TestLogger } from '../utils/logger.js';
import { EnvironmentConfig, ReportPortalConfig, ReportPortalAttribute } from '../types/config.types.js';

// export interface EnvironmentConfig {
//   envName: string;
//   baseUrl: string;
// }

export class ConfigManager {
  /**
   * Reads target test environment from process environment variables
   */
  static getEnvironment(): string {
    return (process.env.TEST_ENV || 'QA').toUpperCase();
  }

  /**
   * Dynamically constructs the configurations based on active environment flags
   */
  static getConfig(): EnvironmentConfig {
    const currentEnv = this.getEnvironment();
    TestLogger.info(`Initializing framework configurations for: [${currentEnv}]`);

    // Assign fallback URLs based on environment variables or explicit defaults
    const baseUrl = process.env.BASE_URL || `https://${currentEnv.toLowerCase()}.saucedemo.com`;

    return {
      envName: currentEnv,
      baseUrl,
    };
  }

   static getReportPortalConfig(): ReportPortalConfig {
    const enabled = process.env.RP_ENABLED === 'true';
    const apiKey = process.env.RP_API_KEY?.trim() ?? '';
    const endpoint = process.env.RP_ENDPOINT?.trim() ?? '';
    const project = process.env.RP_PROJECT?.trim() ?? '';
    const launchName =
      process.env.RP_LAUNCH_NAME?.trim() ||
      `SUT_Automation_Run_${this.getEnvironment()}`;

    const description =
      process.env.RP_DESCRIPTION?.trim() ||
      'Automated execution run driven via core infrastructure framework.';

    const attributes: ReportPortalAttribute[] = [
      { key: 'Environment', value: this.getEnvironment() },
      { key: 'Engine', value: 'TypeScript-Monorepo' }
    ];

    if (!enabled) {
      return {
        enabled: false,
        apiKey: '',
        endpoint: '',
        project: '',
        launchName,
        description,
        attributes,
        includeTestSteps: true, // ◀️ Direct flat property mapping
        uploadTrace: false,     // ◀️ Direct flat property mapping
      };
    }

    const missing: string[] = [];

    if (!apiKey) missing.push('RP_API_KEY');
    if (!endpoint) missing.push('RP_ENDPOINT');
    if (!project) missing.push('RP_PROJECT');

    if (missing.length > 0) {
      TestLogger.warn(
        `ReportPortal is enabled but required variables are missing: ${missing.join(', ')}. ReportPortal will be disabled for this run.`
      );

      return {
        enabled: false,
        apiKey: '',
        endpoint: '',
        project: '',
        launchName,
        description,
        attributes,
        includeTestSteps: true, // ◀️ Direct flat property mapping
        uploadTrace: false,     // ◀️ Direct flat property mapping
      };
    }

    return {
      enabled: true,
      apiKey,
      endpoint,
      project,
      launchName,
      description,
      attributes,
      includeTestSteps: true, // ◀️ Direct flat property mapping
      uploadTrace: false,     // ◀️ Direct flat property mapping
    };
  }
}




