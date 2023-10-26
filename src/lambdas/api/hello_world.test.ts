import { type APIGatewayProxyEventV2 } from 'aws-lambda';
import { defaultContext, defaultEvent } from '../../../tests/factories/Lambda';
import handler from './hello_world';

describe('hello_world', () => {
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

  it('should return a message', async () => {
    const result = await testHarness.callHandler() as any;
    expect(result.body).toEqual(JSON.stringify({
      message: 'Hello World!',
      event: defaultEvent(),
    }));
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

  async callHandler(event?: Partial<APIGatewayProxyEventV2>) {
    return this.handler(defaultEvent(event), defaultContext(), () => {});
  }
}
