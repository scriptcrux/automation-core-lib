import { test } from '@playwright/test';
import { TestLogger } from '@script-crux/core-shared';

export function Step(stepDescription?: string): any {
  return function (target: any, contextOrKey?: any, descriptor?: PropertyDescriptor): any {
    
    // 1. Handling Modern Stage 3 Standard JavaScript Decorators
    if (typeof target === 'function' && contextOrKey && typeof contextOrKey === 'object') {
      const originalMethod = target;
      return async function (this: any, ...args: any[]) {
        const formattedStepName = stepDescription 
          ? stepDescription.replace(/\{(\d+)\}/g, (_, index) => String(args[index] || ''))
          : `Executing action: ${String(contextOrKey.name)}`;

        return await test.step(formattedStepName, async () => {
          TestLogger.info(`[START STEP]: ${formattedStepName}`);
          return await originalMethod.apply(this, args);
        }, { box: true });
      };
    }

    // 2. Fallback for Legacy Experimental TypeScript Decorators
    if (descriptor) {
      const originalMethod = descriptor.value;
      
      descriptor.value = async function (this: any, ...args: any[]) {
        const formattedStepName = stepDescription 
          ? stepDescription.replace(/\{(\d+)\}/g, (_, index) => String(args[index] || ''))
          : `Executing action: ${String(contextOrKey)}`;

        return await test.step(formattedStepName, async () => {
          TestLogger.info(`[START STEP]: ${formattedStepName}`);
          return await originalMethod.apply(this, args);
        }, { box: true });
      };
      return descriptor;
    }
  };
}
