// PK: {COGNITO_USERNAME}
// SK: CONNECTION#{COGNITO_USERNAME}
// SK: USER#{COGNITO_USERNAME}
// SK: FRIEND#{COGNITO_USERNAME}
// SK: USERID#{COGNITO_USERNAME}

import { DynamoDB } from 'aws-sdk';
import {
  UserConnection, User, USER_TABLE_NAME,
} from '../models/users';

export class UserRepository {
  dynamoDb: DynamoDB.DocumentClient;

  constructor() {
    this.dynamoDb = new DynamoDB.DocumentClient();
  }

  async getUserConnection(userId: string): Promise<UserConnection> {
    const params:DynamoDB.DocumentClient.QueryInput = {
      TableName: USER_TABLE_NAME,
      KeyConditionExpression: '#pk = :userId AND begins_with(#sk, :sortKey)',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':sortKey': 'CONNECTION#',
      },
      ExpressionAttributeNames: {
        '#pk': 'userId',
        '#sk': 'sortKey',
      },
    };
    return this.dynamoDb.query(params).promise().then((response) => {
      if (response.$response.error) {
        throw new Error(response.$response.error.message);
      }
      return response.Items?.at(0) as UserConnection;
    });
  }

  async getUserConnectionById(connectionId:string) {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: USER_TABLE_NAME,
      IndexName: 'sortKeyIndex',
      KeyConditionExpression: 'sortKey = :sortKey',
      ExpressionAttributeValues: {
        ':sortKey': `CONNECTION#${connectionId}`,
      },
    };
    return this.dynamoDb.query(params).promise().then((response) => {
      if (response.$response.error) {
        throw new Error(response.$response.error.message);
      }
      return response.Items?.at(0) as UserConnection;
    });
  }

  async saveConnection(userId: string, connectionId: string) {
    const params = {
      TableName: USER_TABLE_NAME,
      Item: {
        userId,
        sortKey: `CONNECTION#${connectionId}`,
        connectionId,
        createdAt: Date.now(),
      },
    };
    const response = await this.dynamoDb.put(params).promise();
    if (response.$response.error) {
      console.error('error saving connection', response.$response.error);
      throw new Error(response.$response.error.message);
    }
  }

  async closeConnection(connectionId: string) {
    const connection = await this.getUserConnectionById(connectionId);
    if (!connection) throw new Error('unable to find connection to close');
    const params = {
      TableName: USER_TABLE_NAME,
      Key: {
        userId: connection.userId,
        sortKey: `CONNECTION#${connectionId}`,
      },
    };
    const response = await this.dynamoDb.delete(params, () => {}).promise();
    if (response.$response.error) {
      console.error('error closing connection', response.$response.error);
      throw new Error(response.$response.error.message);
    }
  }

  async getUsersByPreferredUserName(userName: string) {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: USER_TABLE_NAME,
      IndexName: 'sortKeyIndex',
      KeyConditionExpression: 'sortKey = :sortKey',
      ExpressionAttributeValues: {
        ':sortKey': `USERID#${userName}`,
      },
    };
    const response = await this.dynamoDb.query(params).promise();
    if (response.$response.error) {
      throw new Error(response.$response.error.message);
    }
    return response.Items as User[];
  }

  async findUserByUserName(userId:string) {
    const params:DynamoDB.DocumentClient.QueryInput = {
      TableName: USER_TABLE_NAME,
      KeyConditionExpression: 'userId = :userId AND sortKey = :sortKey',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':sortKey': `USER#${userId}`,
      },
    };
    const response = await this.dynamoDb.query(params).promise();
    if (response.$response.error) {
      throw new Error(response.$response.error.message);
    }
    return response.Items?.at(0) as User;
  }

  async findUserByPublicId(prefferedUserName:string, discriminator: string) {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: USER_TABLE_NAME,
      IndexName: 'sortKeyIndex',
      KeyConditionExpression: 'sortKey = :sortKey',
      FilterExpression: 'discriminator = :discriminator',
      ExpressionAttributeValues: {
        ':sortKey': `USERID#${prefferedUserName}`,
        ':discriminator': discriminator,
      },
    };
    const response = await this.dynamoDb.query(params).promise();
    if (response.$response.error) {
      throw new Error(JSON.stringify(response.$response.error));
    }
    if (response.Items?.at(0) && response.Items?.at(0)?.userId) {
      return this.findUserByUserName(response.Items?.at(0)?.userId);
    }
    throw new Error('Could not find user.');
  }

  private async saveUserPreferredUsername(
    userId:string,
    preferredUsername: string,
    discriminator: string,
  ) {
    const params = {
      TableName: USER_TABLE_NAME,
      Item: {
        userId,
        sortKey: `USERID#${preferredUsername}`,
        discriminator,
        createdAt: Date.now(),
      },
    };
    const response = await this.dynamoDb.put(params).promise();
    if (response.$response.error) {
      console.error('error saving connection', response.$response.error);
      throw new Error(response.$response.error.message);
    }
  }

  async saveUser(user: User) {
    const params = {
      TableName: USER_TABLE_NAME,
      Item: {
        ...user,
        sortKey: `USER#${user.userId}`,
        createdAt: Date.now(),
      },
    };
    const users = await this.getUsersByPreferredUserName(user.preferredUserName);
    let discriminator = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    const func = (it) => Number(it.discriminator) === discriminator;
    do {
      discriminator = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    } while (users.find(func) !== undefined);
    params.Item.discriminator = String(discriminator);
    const response = await this.dynamoDb.put(params).promise();
    if (response.$response.error) {
      console.error('error saving user', response.$response.error);
      throw new Error(response.$response.error.message);
    }
    await this.saveUserPreferredUsername(
      user.userId,
      user.preferredUserName,
      String(discriminator),
    );
  }

  async recordChannel(userOne: string, userTwo:string, channelId: string) {
    const params = {
      TableName: USER_TABLE_NAME,
      Key: {
        userName: userOne,
        sortKey: `FRIEND#${userTwo}`,
      },
      UpdateExpression: 'set #channel = :channel',
      ExpressionAttributeNames: { '#channel': 'channel' },
      ExpressionAttributeValues: {
        ':channel': channelId,
      },
    };
    const response = await this.dynamoDb.update(params).promise();
    if (response.$response.error) {
      console.error('error recording channel', response.$response.error);
      throw new Error(response.$response.error.message);
    }
  }
}
