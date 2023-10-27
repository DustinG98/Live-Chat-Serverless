import { APIGatewayProxyResultV2, APIGatewayProxyWebsocketHandlerV2 } from 'aws-lambda';

const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
  try {
    if (event.requestContext.eventType === 'CONNECT') {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Connected.' }),
      } as APIGatewayProxyResultV2<never>;
    }
    // TODO: Handle disconnect
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Disconnected.' }),
    } as APIGatewayProxyResultV2<never>;
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'There was an error connecting/disconnecting' }),
    };
  }
};

export default handler;
