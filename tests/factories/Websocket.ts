import { APIGatewayEventWebsocketRequestContextV2, APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';

export const defaultContext = (
  options?: Partial<APIGatewayEventWebsocketRequestContextV2>,
): APIGatewayEventWebsocketRequestContextV2 => ({
  routeKey: '$connect',
  messageId: 'd3d58d0e-6e8f-4e0e-8b5a-8a9a0f7c7c3e',
  eventType: 'CONNECT',
  extendedRequestId: 'd3d58d0e-6e8f-4e0e-8b5a-8a9a0f7c7c3e',
  requestTime: '01/Jan/2021:00:00:00 +0000',
  messageDirection: 'IN',
  stage: 'dev',
  connectedAt: 1609459200,
  requestTimeEpoch: 1609459200000,
  requestId: 'd3d58d0e-6e8f-4e0e-8b5a-8a9a0f7c7c3e',
  domainName: 'domain',
  connectionId: '123',
  apiId: 'app',
  ...options,
});

export const defaultEvent = (
  options?: Partial<APIGatewayProxyWebsocketEventV2>,
): APIGatewayProxyWebsocketEventV2 => ({
  requestContext: defaultContext(),
  isBase64Encoded: false,
  ...options,
});
