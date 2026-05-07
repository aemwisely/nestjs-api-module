import { TokenOwnerMismatchException } from '@libs/common/exception';
import { TokenModel } from '@libs/core/domain/token';
import { RevokeTokenUseCase } from './revoke-token.use-case';

describe('RevokeTokenUseCase', () => {
  const context = {
    sub: '019b02b0-0000-7000-8000-000000000001',
    email: 'jane@example.com',
    session_id: '019b02b0-0000-7000-8000-000000000002',
  };

  const token = TokenModel.create({
    user_id: context.sub,
    access_token: 'access-token',
    refresh_token: 'refresh-token',
    session_id: context.session_id,
    expires_at: new Date(Date.now() + 15 * 60 * 1000),
    refresh_expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  });

  function createUseCase() {
    const tokenStorageRepository = {
      findById: jest.fn().mockResolvedValue(token),
      findByAccessToken: jest.fn().mockResolvedValue(token),
      findByRefreshToken: jest.fn().mockResolvedValue(token),
      revokeToken: jest.fn().mockResolvedValue(undefined),
      revokeAllUserTokens: jest.fn().mockResolvedValue(undefined),
    };

    return {
      useCase: new RevokeTokenUseCase(tokenStorageRepository as any),
      tokenStorageRepository,
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('revokes the token used by the current request', async () => {
    const { useCase, tokenStorageRepository } = createUseCase();

    await useCase.revokeCurrentToken('access-token', context);

    expect(tokenStorageRepository.findByAccessToken).toHaveBeenCalledWith('access-token');
    expect(tokenStorageRepository.revokeToken).toHaveBeenCalledWith(token.id);
  });

  it('prevents users from revoking another user token', async () => {
    const { useCase, tokenStorageRepository } = createUseCase();
    tokenStorageRepository.findByAccessToken.mockResolvedValue(
      TokenModel.create({
        user_id: '019b02b0-0000-7000-8000-000000000999',
        access_token: 'another-access-token',
        refresh_token: 'another-refresh-token',
        session_id: context.session_id,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
        refresh_expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      }),
    );

    await expect(
      useCase.revokeCurrentToken('another-access-token', context),
    ).rejects.toBeInstanceOf(TokenOwnerMismatchException);
    expect(tokenStorageRepository.revokeToken).not.toHaveBeenCalled();
  });
});
