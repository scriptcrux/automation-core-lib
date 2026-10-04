import { TestLogger } from '../utils/logger.js';

export type EnvVarType = 'string' | 'number' | 'boolean';

export interface EnvFieldDefinition<T = any> {
  required?: boolean;
  default?: T;
  type?: EnvVarType;
  description?: string;
}

export type EnvSchema<T> = {
  [K in keyof T]: EnvFieldDefinition<T[K]>;
};

export class EnvValidationError extends Error {
  public missingVars: string[];
  public typeErrors: string[];

  constructor(message: string, missingVars: string[] = [], typeErrors: string[] = []) {
    super(message);
    this.name = 'EnvValidationError';
    this.missingVars = missingVars;
    this.typeErrors = typeErrors;
  }
}

export class EnvValidator {
  /**
   * Validates and parses environment variables against a declarative schema definition.
   */
  public static validateAndParse<T extends Record<string, any>>(
    schema: EnvSchema<T>,
    sourceEnv: Record<string, string | undefined> = process.env
  ): T {
    const result: Partial<T> = {};
    const missing: string[] = [];
    const typeErrors: string[] = [];

    for (const key of Object.keys(schema) as Array<keyof T>) {
      const field = schema[key];
      const rawValue = sourceEnv[key as string];

      if (rawValue === undefined || rawValue.trim() === '') {
        if (field.required) {
          missing.push(String(key));
          continue;
        }
        if (field.default !== undefined) {
          result[key] = field.default;
          continue;
        }
        result[key] = undefined as any;
        continue;
      }

      // Type parsing
      const type = field.type || 'string';
      switch (type) {
        case 'number': {
          const num = Number(rawValue);
          if (isNaN(num)) {
            typeErrors.push(`Field '${String(key)}' expected number, got '${rawValue}'`);
          } else {
            result[key] = num as any;
          }
          break;
        }
        case 'boolean': {
          const lower = rawValue.toLowerCase().trim();
          if (lower === 'true' || lower === '1') {
            result[key] = true as any;
          } else if (lower === 'false' || lower === '0') {
            result[key] = false as any;
          } else {
            typeErrors.push(`Field '${String(key)}' expected boolean (true/false), got '${rawValue}'`);
          }
          break;
        }
        case 'string':
        default:
          result[key] = rawValue.trim() as any;
          break;
      }
    }

    if (missing.length > 0 || typeErrors.length > 0) {
      const errorMsgParts: string[] = [];
      if (missing.length > 0) {
        errorMsgParts.push(`Missing mandatory environment variable(s): ${missing.join(', ')}`);
      }
      if (typeErrors.length > 0) {
        errorMsgParts.push(`Invalid environment variable type(s):\n  - ${typeErrors.join('\n  - ')}`);
      }
      const fullError = `Environment Configuration Validation Failed:\n${errorMsgParts.join('\n')}`;
      TestLogger.error(fullError);
      throw new EnvValidationError(fullError, missing, typeErrors);
    }

    return result as T;
  }
}
