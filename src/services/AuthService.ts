import { CognitoIdentityServiceProvider, DynamoDB } from 'aws-sdk';
import { AuthenticationResultType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { UserRepository } from '../repositories/UserRepository';
import { AuthRequest } from '../models/auth';

export class AuthService {
  userRepo: UserRepository;

  cognito: CognitoIdentityServiceProvider;

  dynamoDb: DynamoDB.DocumentClient;

  userPoolId: string;

  clientId: string;

  userTable = 'Users';

  constructor() {
    this.userRepo = new UserRepository();
    this.cognito = new CognitoIdentityServiceProvider();
    this.dynamoDb = new DynamoDB.DocumentClient();
    this.userPoolId = process.env.COGNITO_USER_POOL_ID ? process.env.COGNITO_USER_POOL_ID : '';
    this.clientId = process.env.COGNITO_CLIENT_ID ? process.env.COGNITO_CLIENT_ID : '';
  }

  async login(body: AuthRequest): Promise<AuthenticationResultType> {
    const Params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: body.email,
        PASSWORD: body.password,
      },
    };
    const result = (await this.cognito.initiateAuth(Params).promise())?.AuthenticationResult;
    if (!result) {
      throw new Error('An error occured');
    }
    return result;
  }
}
