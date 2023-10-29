import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { AuthenticationResultType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { AuthRequest } from '../models/auth';

export class AuthService {
  cognito: CognitoIdentityServiceProvider;

  clientId: string;

  constructor() {
    this.cognito = new CognitoIdentityServiceProvider();
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
