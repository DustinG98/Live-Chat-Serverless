import { type APIGatewayProxyEventV2, type APIGatewayProxyHandlerV2, type APIGatewayProxyResultV2 } from 'aws-lambda';

const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2):
Promise<APIGatewayProxyResultV2> => ({
  statusCode: 200,
  body: JSON.stringify({
    message: 'Hello World!',
    event,
  }),
});

export default handler;
