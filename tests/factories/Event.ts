import { APIGatewayProxyEventV2, Context } from 'aws-lambda';

export const defaultEvent = (options?: Partial<APIGatewayProxyEventV2>) => ({
  version: '1.0.0',
  rawPath: '/login',
  rawQueryString: '',
  requestContext: {
    accountId: 'a123',
    apiId: 'app',
    domainName: 'domain',
    domainPrefix: 'www',
    http: {
      method: 'POST',
      path: '/',
      protocol: 'https',
      sourceIp: '123',
      userAgent: 'u123',
    },
    requestId: 'request',
    routeKey: 'r123',
    stage: 'dev',
    time: Date.now().toString(),
    timeEpoch: Date.now(),
  },
  routeKey: '123',
  isBase64Encoded: false,
  headers: {},
  ...options,
});

export const defaultContext = (options?: Partial<Context>) => ({
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'func',
  functionVersion: '1',
  invokedFunctionArn: '123',
  memoryLimitInMB: '1028',
  awsRequestId: 'request',
  logGroupName: 'logs',
  logStreamName: 'logs stream',
  getRemainingTimeInMillis: () => Date.now(),
  done: () => {},
  fail: () => {},
  succeed: () => {},
  ...options,
});
