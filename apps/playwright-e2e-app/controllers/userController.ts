import { APIRequestContext } from '@playwright/test';
import { BaseApi } from '@script-crux/adapter-playwright';
import { PRODUCT_ENDPOINTS } from '../types/endpoints.js';

export class UserController extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async createNewAccount(payload: Record<string, unknown>): Promise<void> {
    const response = await this.post(PRODUCT_ENDPOINTS.USERS, payload);

    if (!response.ok()) {
      throw new Error(`[ACCOUNT CREATION FAILED]: Server dropped status code ${response.status()}`);
    }
  }
}
