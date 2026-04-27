import { AuthController } from './auth.controller';

describe('AuthController', () => {
  const loginUseCase = {
    execute: jest.fn(),
  };
  const getSelfUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('wraps login results in a result object', async () => {
    const controller = new AuthController(loginUseCase as any, getSelfUseCase as any);
    loginUseCase.execute.mockResolvedValue({ access_token: 'a', refresh_token: 'r' });

    const result = await controller.login({ email: 'jane@example.com', password: 'secret' } as any);

    expect(loginUseCase.execute).toHaveBeenCalledWith('jane@example.com', 'secret');
    expect(result).toEqual({
      result: { access_token: 'a', refresh_token: 'r' },
    });
  });

  it('wraps self results in a result object', async () => {
    const controller = new AuthController(loginUseCase as any, getSelfUseCase as any);
    getSelfUseCase.execute.mockResolvedValue({ id: 'user-1' });
    const context = { sub: 'user-1', email: 'jane@example.com' };

    const result = await controller.getSelf(context);

    expect(getSelfUseCase.execute).toHaveBeenCalledWith(context);
    expect(result).toEqual({ result: { id: 'user-1' } });
  });
});
