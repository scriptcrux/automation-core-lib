import { Pool, PoolConfig } from 'pg';
import { IDbClient } from './idbClient';
import { TestLogger } from '@script-crux/core-shared';
import { DatabaseError } from '../errors/databaseError';

export class PostgresClient implements IDbClient {
private pool: Pool;

    constructor(config: PoolConfig) {
        this.pool = new Pool(config);
    }

    async connect(): Promise<void> {
        const client = await this.pool.connect();
        client.release();
        TestLogger.info('Connected to PostgreSQL database engine.');
    }

    async find<T = any>(tableName: string, criteria: { rawSql: string; params?: any[] }): Promise<T[]> {
        try {
            TestLogger.info(`Executing PostgreSQL query on [${tableName}]`);
            const result = await this.pool.query(criteria.rawSql, criteria.params);
            return result.rows as T[];
        } catch (error) {
            throw new DatabaseError((error as Error).message, 'PostgreSQL');
        }
    }

    async disconnect(): Promise<void> {
        await this.pool.end();
    }
}
