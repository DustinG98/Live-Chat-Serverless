import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { AuthService } from '../../services/AuthService';
import { AuthRequest } from '../../models/auth';

const handler:APIGatewayProxyHandlerV2 = async ({ body: str }) => {
  try {
    if (!str) {
      throw new Error('Missing login details.');
    }
    const body = JSON.parse(str) as AuthRequest;
    if (!body.email || !body.password) {
      throw new Error('Missing login details.');
    }
    const authService = new AuthService();
    const token = await authService.login(body);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success', token }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'There was an error logging in.', error: err }),
    };
  }
};

export default handler;
