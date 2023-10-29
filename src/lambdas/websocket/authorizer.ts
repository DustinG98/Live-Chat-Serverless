import { CognitoJwtVerifier } from 'aws-jwt-verify';

/**
 * @description Creates the IAM policy for the response.
 */
const generatePolicy = (principalId: any, effect: any, resource: any, data: any) => {
  // @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
  const authResponse: any = {
    principalId,
  };

  if (effect && resource) {
    const policyDocument: any = {
      Version: '2012-10-17',
      Statement: [],
    };

    const statement = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource,
    };

    policyDocument.Statement[0] = statement;
    authResponse.policyDocument = policyDocument;
  }

  authResponse.context = {
    stringKey: JSON.stringify(data),
  };

  return authResponse;
};

const handler = async (event) => {
  const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID ?? '',
    tokenUse: 'access',
    clientId: process.env.COGNITO_CLIENT_ID,
  });

  try {
    const payload = await jwtVerifier.verify(event.queryStringParameters?.token
        ?? event.headers.Authorization, { clientId: process.env.COGNITO_CLIENT_ID ?? '' });
    // allow access
    return generatePolicy(payload.sub, 'Allow', event.methodArn, payload);
  } catch (err) {
    // deny access
    return generatePolicy('user', 'Deny', event.methodArn, {});
  }
};

export default handler;
