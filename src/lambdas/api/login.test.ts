import handler from './login';
import * as Auth from '../../services/AuthService';
import { defaultContext, defaultEvent } from '../../../tests/factories/Lambda';

jest.mock('../../services/AuthService');

describe('login handler', () => {
  let testHarness: TestHarness;

  beforeEach(() => {
    testHarness = new TestHarness();
  });

  afterEach(() => {
    testHarness.mockReset();
  });

  it('returns 500 with error if no body', async () => {
    expect(await handler(defaultEvent(), defaultContext(), () => {})).toEqual({
      statusCode: 500,
      body: JSON.stringify({ message: 'There was an error logging in.', error: new Error('Missing login details.') }),
    });
  });

  it('returns 500 with error if missing email', async () => {
    expect(await handler({ ...defaultEvent(), body: '{"password": "123"}' }, defaultContext(), () => {})).toEqual({
      statusCode: 500,
      body: JSON.stringify({ message: 'There was an error logging in.', error: new Error('Missing login details.') }),
    });
  });
  it('calls login with login details', async () => {
    await handler(
      { ...defaultEvent(), body: JSON.stringify(testHarness.loginBody) },
      defaultContext(),
      () => {},
    );
    expect(testHarness.loginSpy).toHaveBeenCalledTimes(1);
    expect(testHarness.loginSpy).toHaveBeenCalledWith(testHarness.loginBody);
  });

  it('returns 200 with token', async () => {
    expect(await handler(
      { ...defaultEvent(), body: JSON.stringify(testHarness.loginBody) },
      defaultContext(),
      () => {},
    )).toEqual({
      statusCode: 200,
      body: JSON.stringify({ message: 'Success', token: testHarness.loginResult }),
    });
  });
  it('returns 500 if error logging in', async () => {
    testHarness.loginSpy.mockRejectedValueOnce(new Error('Error'));
    expect(await handler(
      { ...defaultEvent(), body: JSON.stringify(testHarness.loginBody) },
      defaultContext(),
      () => {},
    )).toEqual({
      statusCode: 500,
      body: JSON.stringify({ message: 'There was an error logging in.', error: {} }),
    });
  });
});

class TestHarness {
  loginSpy: jest.SpyInstance;

  loginBody = { password: '123', email: 'abc@123.com' };

  loginResult = {
    AccessToken: 'abc123',
  };

  constructor() {
    this.loginSpy = jest.spyOn(Auth.AuthService.prototype, 'login').mockImplementation(async () => Promise.resolve(this.loginResult));
  }

  mockReset() {
    this.loginSpy.mockReset();
  }
}
