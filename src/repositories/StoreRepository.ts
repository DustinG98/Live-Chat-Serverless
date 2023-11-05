// PK: {STORE_ID}
// SK: STORE#{STORE_ID}
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { StoreCreateRequest, STORE_TABLE_NAME } from '../models/stores';

export class StoreRepository {
  dynamoDb: DynamoDB.DocumentClient;

  constructor() {
    this.dynamoDb = new DynamoDB.DocumentClient();
  }

  async createStore(store: StoreCreateRequest): Promise<void> {
    const storeId = uuidv4();
    const params = {
      TableName: STORE_TABLE_NAME,
      Item: {
        storeId,
        sortKey: `STORE#${storeId}`,
        ...store,
      },
    };
    await this.dynamoDb.put(params).promise();
  }
}
