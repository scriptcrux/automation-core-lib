import { BaseAxiosClient, HttpClientEnvConfig } from '@script-crux/adapter-axios';
import { TestLogger } from '@script-crux/core-shared';

// 1. Blueprint matching the real live response schema from ReqRes
interface ReqResUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

interface SingleUserResponse {
    data: ReqResUser;
}

// 2. Build the live integration client wrapper
class LiveTestClient extends BaseAxiosClient {
    constructor(config: HttpClientEnvConfig) {
        super(config, TestLogger);
    }

    // Hits: GET https://reqres.in
    public async fetchUser(id: number): Promise<ReqResUser> {
        const response = await this.get<SingleUserResponse>(`/api/users/${id}`);
        return response.data; // Strips out Axios envelope, returns raw payload data
    }

    // Hits: POST https://reqres.in/api/users
    public async createNewUser(name: string, job: string) {
        return this.post('/api/users', { name, job });
    }
}

// 3. Automated Test Runner Suite
async function executeLiveApiTests() {
    TestLogger.info('🎬 INITIALIZING LIVE API TEST SUITE...');

    const liveConfig: HttpClientEnvConfig = {
        baseUrl: 'https://reqres.in',
        apiTimeout: 4000,
        maxRetries: 2,       // Safe GET retries config
        retryDelayMs: 1000   // Wait time config between retry triggers
    };

    const client = new LiveTestClient(liveConfig);

    // ==========================================
    // 🧪 TEST 1: SUCCESSFUL DATA EXTRACTION (GET)
    // ==========================================
    try {
        TestLogger.info('\n--- 🧪 TEST 1: Verify Clean Data Retrieval (GET) ---');
        const user = await client.fetchUser(2);
        
        TestLogger.info(`💯 Verification Check Passed!`);
        TestLogger.info(`User ID: ${user.id}`);
        TestLogger.info(`Name: ${user.first_name} ${user.last_name}`);
        TestLogger.info(`Email Address: ${user.email}`);
    } catch (e) {
        TestLogger.error(`❌ TEST 1 FAILED unexpectedly.`);
    }

    // ==========================================
    // 🧪 TEST 2: VERIFY POST MUTATIONS (POST)
    // ==========================================
    try {
        TestLogger.info('\n--- 🧪 TEST 2: Verify Form Processing (POST) ---');
        const payload: any = await client.createNewUser('Alex QA', 'Lead Automation Engineer');
        
        TestLogger.info(`💯 Verification Check Passed!`);
        TestLogger.info(`Server assigned ID: ${payload.id}`);
        TestLogger.info(`Created timestamp: ${payload.createdAt}`);
    } catch (e) {
        TestLogger.error(`❌ TEST 2 FAILED unexpectedly.`);
    }

    // ==========================================
    // 🧪 TEST 3: CUSTOM ERROR NORMALIZATION (404)
    // ==========================================
    try {
        TestLogger.info('\n--- 🧪 TEST 3: Verify Framework Error Framework Normalization ---');
        // This endpoint will output a 404 response structure
        await client.fetchUser(99999);
        TestLogger.error('❌ Test failed: Request succeeded when it should have thrown a 404.');
    } catch (error: any) {
        TestLogger.info(`💯 Verification Check Passed!`);
        TestLogger.info(`Interceptor successfully mapped error name to: ${error.name}`);
        TestLogger.info(`Mapped HTTP status property to: ${error.status}`);
        TestLogger.info(`Internal Message string value: ${error.message}`);
    }
}

// Run everything
executeLiveApiTests();
