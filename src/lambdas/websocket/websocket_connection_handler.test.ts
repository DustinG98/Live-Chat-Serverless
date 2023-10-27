import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { defaultContext } from '../../../tests/factories/Lambda';
import handler from './websocket_connection_handler';
import { defaultEvent, defaultContext as defaultWebsocketContext } from '../../../tests/factories/Websocket';

describe('websocket_connection_handler', () => {
  let testHarness: TestHarness;

  beforeEach(() => {
    testHarness = new TestHarness();
  });

  afterEach(() => {
    testHarness.resetMocks();
  });

  it('should return a 200', async () => {
    const result = await testHarness.callHandler() as any;
    expect(result.statusCode).toEqual(200);
  });

  it('should return a CONNECTED message for connected context', async () => {
    const result = await testHarness.callHandler() as any;
    expect(result.body).toEqual(JSON.stringify({ message: 'Connected.' }));
  });

  it('should return a DISCONNECTED message for disconencted context', async () => {
    const result = await testHarness.callHandler({
      requestContext: defaultWebsocketContext({ eventType: 'DISCONNECT' }),
    }) as any;
    expect(result.body).toEqual(JSON.stringify({ message: 'Disconnected.' }));
  });
});

class TestHarness {
  handler: typeof handler;

  constructor() {
    this.handler = handler;
  }

  resetMocks() {
    this.handler = handler;
    jest.resetAllMocks();
  }

  async callHandler(event?: Partial<APIGatewayProxyWebsocketEventV2>) {
    return this.handler(defaultEvent(event), defaultContext(), () => ({}));
  }
}
