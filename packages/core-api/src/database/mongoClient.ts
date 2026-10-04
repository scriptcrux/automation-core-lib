import { MongoClient as MongoDriver, Db } from 'mongodb';
import { IDbClient } from './idbClient';
import { TestLogger } from '@script-crux/core-shared';

export class MongoClient implements IDbClient {
  private client: MongoDriver;
  private db!: Db;
  private dbName: string;

  constructor(uri: string, dbName: string) {
    this.client = new MongoDriver(uri);
    this.dbName = dbName;
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    TestLogger.info(`Successfully connected to MongoDB database: [${this.dbName}]`);
  }

  async find<T = any>(collectionName: string, filter: any = {}): Promise<T[]> {
    try {
      TestLogger.info(`NoSQL query executing on collection [${collectionName}] with filter: ${JSON.stringify(filter)}`);
      const collection = this.db.collection(collectionName);
      const results = await collection.find(filter).toArray();
      return results as unknown as T[];
    } catch (error) {
      TestLogger.error(`MongoDB Query Failed: ${(error as Error).message}`);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    TestLogger.info('Closing MongoDB connections...');
    await this.client.close();
  }
}
