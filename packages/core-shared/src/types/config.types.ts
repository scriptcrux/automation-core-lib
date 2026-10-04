export interface EnvironmentConfig {
  envName: string;
  baseUrl: string;
  dbTimeout?: number;
}

export interface ReportPortalAttribute {
  key?: string;
  value: string;
}

export interface ReportPortalConfig {
  enabled: boolean;
  apiKey: string;
  endpoint: string;
  project: string;
  launchName: string;
  description: string;
  attributes: ReportPortalAttribute[];
  includeTestSteps: boolean;
  uploadTrace: boolean;
}
