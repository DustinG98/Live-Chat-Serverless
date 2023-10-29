import { CognitoIdentityServiceProvider, DynamoDB } from 'aws-sdk';
import { AuthenticationResultType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { UserRepository } from '../repositories/UserRepository';
import { AuthRequest, RegisterRequest } from '../models/auth';

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

  async register(body: RegisterRequest): Promise<void> {
    const params = {
      UserPoolId: this.userPoolId,
      Username: body.email,
      UserAttributes: [
        {
          Name: 'email',
          Value: body.email,
        },
        {
          Name: 'preferred_username',
          Value: body.username,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
      MessageAction: 'SUPPRESS',
    };
    const user = (await this.cognito.adminCreateUser(params).promise()).User;
    if (!user) {
      throw new Error('Error creating user');
    }
    const sub = user.Attributes?.find((attr) => attr.Name === 'sub')?.Value;
    if (!sub) {
      throw new Error('Error creating user');
    }

    await this.userRepo.saveUser({
      userId: sub,
      userName: body.email,
      preferredUserName: body.username,
    });
    const Params = {
      Password: body.password,
      UserPoolId: this.userPoolId,
      Username: body.email,
      Permanent: true,
    };
    await this.cognito.adminSetUserPassword(Params).promise();
  }
}
