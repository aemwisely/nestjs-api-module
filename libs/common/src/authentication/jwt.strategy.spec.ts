import { AccessTokenInvalidException } from '../exception';
import { JwtStrategy } from './jwt.stategy';

describe('JwtStrategy', () => {
  function createStrategy(findOne: jest.Mock) {
    const datasource = {
      manager: {
        findOne,
      },
    };
    const configService = {
      getOrThrow: jest.fn().mockReturnValue('secret'),
    };

    return new JwtStrategy(datasource as any, configService as any);
  }

  it('validates the exact active access token from the authorization header', async () => {
    const findOne = jest
      .fn()
      .mockResolvedValueOnce({
        id: '019b02b0-0000-7000-8000-000000000001',
        email: 'jane@example.com',
        is_active: true,
        role_id: '019b02b0-0000-7000-8000-000000000003',
      })
      .mockResolvedValueOnce({
        access_token: 'active-access-token',
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
      });
    const strategy = createStrategy(findOne);

    const result = await strategy.validate(
      { headers: { authorization: 'Bearer active-access-token' } } as any,
      {
        sub: '019b02b0-0000-7000-8000-000000000001',
        email: 'jane@example.com',
        session_id: '019b02b0-0000-7000-8000-000000000002',
      },
    );

    expect(result).toEqual({
      sub: '019b02b0-0000-7000-8000-000000000001',
      email: 'jane@example.com',
      role_id: '019b02b0-0000-7000-8000-000000000003',
      session_id: '019b02b0-0000-7000-8000-000000000002',
    });
    expect(findOne).toHaveBeenLastCalledWith(
      expect.any(Function),
      expect.objectContaining({
        where: {
          access_token: 'active-access-token',
          session_id: '019b02b0-0000-7000-8000-000000000002',
          user_id: '019b02b0-0000-7000-8000-000000000001',
          is_revoked: false,
        },
      }),
    );
  });

  it('rejects a stale access token even when the session still has another active token', async () => {
    const findOne = jest
      .fn()
      .mockResolvedValueOnce({
        id: '019b02b0-0000-7000-8000-000000000001',
        email: 'jane@example.com',
        is_active: true,
      })
      .mockResolvedValueOnce(null);
    const strategy = createStrategy(findOne);

    await expect(
      strategy.validate({ headers: { authorization: 'Bearer stale-access-token' } } as any, {
        sub: '019b02b0-0000-7000-8000-000000000001',
        email: 'jane@example.com',
        session_id: '019b02b0-0000-7000-8000-000000000002',
      }),
    ).rejects.toBeInstanceOf(AccessTokenInvalidException);
  });

  it('rejects an inactive user even when the token payload is valid', async () => {
    const findOne = jest.fn().mockResolvedValueOnce({
      id: '019b02b0-0000-7000-8000-000000000001',
      email: 'jane@example.com',
      is_active: false,
    });
    const strategy = createStrategy(findOne);

    await expect(
      strategy.validate({ headers: { authorization: 'Bearer active-access-token' } } as any, {
        sub: '019b02b0-0000-7000-8000-000000000001',
        email: 'jane@example.com',
        session_id: '019b02b0-0000-7000-8000-000000000002',
      }),
    ).rejects.toThrow();
  });

  it('rejects a token row whose stored expiration has passed', async () => {
    const findOne = jest
      .fn()
      .mockResolvedValueOnce({
        id: '019b02b0-0000-7000-8000-000000000001',
        email: 'jane@example.com',
        is_active: true,
      })
      .mockResolvedValueOnce({
        access_token: 'expired-access-token',
        expires_at: new Date(Date.now() - 1000),
      });
    const strategy = createStrategy(findOne);

    await expect(
      strategy.validate({ headers: { authorization: 'Bearer expired-access-token' } } as any, {
        sub: '019b02b0-0000-7000-8000-000000000001',
        email: 'jane@example.com',
        session_id: '019b02b0-0000-7000-8000-000000000002',
      }),
    ).rejects.toBeInstanceOf(AccessTokenInvalidException);
  });
});
