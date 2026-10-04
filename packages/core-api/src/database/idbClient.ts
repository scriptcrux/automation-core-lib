export interface IDbClient {
  /**
   * Initializes network connections to the target database instance
   */
  connect(): Promise<void>;

  /**
   * Universal data retrieval contract
   * @param collectionOrTable The target table or collection name
   * @param criteria Query payload (SQL text object or NoSQL filter schema)
   */
  find<T = any>(collectionOrTable: string, criteria: any): Promise<T[]>;

  /**
   * Gracefully terminates connection pools
   */
  disconnect(): Promise<void>;
}
