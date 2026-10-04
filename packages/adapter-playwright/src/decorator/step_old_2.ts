import { test } from '@playwright/test';
import { TestLogger } from '@script-crux/core-shared';

export function Step(stepDescription?: string): any {
  return function (target: any, contextOrKey?: any, descriptor?: PropertyDescriptor): any {
    
    // 1. Handling Modern Stage 3 Standard JavaScript Decorators
    if (typeof target === 'function' && contextOrKey && typeof contextOrKey === 'object') {
      const originalMethod = target;
      const stepName = stepDescription || `Executing action: ${String(contextOrKey.name)}`;

      return async function (this: any, ...args: any[]) {
        TestLogger.info(`[START STEP]: ${stepName}`);
        return await test.step(stepName, async () => {
          return await originalMethod.apply(this, args);
        });
      };
    }

    // 2. Fallback for Legacy Experimental TypeScript Decorators
    if (descriptor) {
      const originalMethod = descriptor.value;
      const stepName = stepDescription || `Executing action: ${String(contextOrKey)}`;

      descriptor.value = async function (this: any, ...args: any[]) {
        TestLogger.info(`[START STEP]: ${stepName}`);
        return await test.step(stepName, async () => {
          return await originalMethod.apply(this, args);
        });
      };
      return descriptor;
    }
  };
}
