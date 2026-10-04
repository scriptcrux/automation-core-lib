import 'mocha';
import { expect } from 'chai';
import { ReqResClient } from './reqres-client';
import { TestLogger } from '@script-crux/core-shared';

describe('Axios Client Integration Tests (Mocha + Chai)', () => {
    let client: ReqResClient;

    before(() => {
        const config = {
            // Changed to a highly reliable free public sandbox API
            baseUrl: 'https://jsonplaceholder.typicode.com',
            apiTimeout: 5000
        };
        client = new ReqResClient(config, TestLogger);
    });

    it('should successfully fetch live data via GET', async () => {
        const post = await client.getUser(1);

        expect(post).to.not.be.undefined;
        expect(post.id).to.equal(1);
        expect(post.title).to.be.a('string');
    });

    it('should process a payload mutation via POST', async () => {
        const result = await client.createNewUser('Test Title', 'Test Body');

        expect(result.id).to.not.be.undefined;
        expect(result.title).to.equal('Test Title');
    });

    it('should normalize a 404 response error cleanly', async () => {
        try {
            // ID 999999 does not exist, forcing a true 404 response error code
            await client.getUser(999999);
            throw new Error('Test expected request to fail but it succeeded');
        } catch (error: any) {
            expect(error.name).to.equal('FrameworkApiError');
            expect(error.status).to.equal(404);
        }
    });
});
