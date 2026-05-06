import { TokenAlreadyUsedException } from '@libs/common/exception';
import { TokenModel } from '@libs/core/domain/token';
import { RefreshTokenUseCase } from './refresh-token.use-case';

describe('RefreshTokenUseCase', () => {
  const storedToken = TokenModel.create({
    user_id: '019b02b0-0000-7000-8000-000000000001',
    access_token: 'old-access-token',
    refresh_token: 'old-refresh-token',
    session_id: '019b02b0-0000-7000-8000-000000000002',
    expires_at: new Date(Date.now() + 15 * 60 * 1000),
    refresh_expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  });

  function createUseCase() {
    const tokenStorageRepository = {
      findByRefreshToken: jest.fn().mockResolvedValue(storedToken),
      rotateToken: jest.fn().mockImplementation(async (_currentTokenId, token) => token),
      updateToken: jest.fn().mockImplementation(async (token) => token),
    };
    const tokenFunctionalRepository = {
      verifyRefreshToken: jest.fn().mockResolvedValue({
        sub: storedToken.user_id,
        email: 'stale@example.com',
        session_id: storedToken.session_id,
        iat: 100,
        exp: 200,
      }),
      generateAccessToken: jest.fn().mockResolvedValue('new-access-token'),
      generateRefreshToken: jest.fn().mockResolvedValue('new-refresh-token'),
    };
    const getUserUseCase = {
      getOneEntity: jest.fn().mockResolvedValue({
        id: storedToken.user_id,
        email: 'jane@example.com',
      }),
    };
    const updateUserUseCase = {
      execute: jest.fn().mockResolvedValue(true),
    };

    return {
      useCase: new RefreshTokenUseCase(
        tokenStorageRepository as any,
        tokenFunctionalRepository as any,
        getUserUseCase as any,
        updateUserUseCase as any,
      ),
      tokenStorageRepository,
      tokenFunctionalRepository,
      updateUserUseCase,
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rotates refresh tokens atomically and signs new tokens with a clean payload', async () => {
    const { useCase, tokenStorageRepository, tokenFunctionalRepository, updateUserUseCase } =
      createUseCase();

    const result = await useCase.execute('old-refresh-token', true);

    expect(result).toEqual({
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
    });
    expect(tokenFunctionalRepository.generateAccessToken).toHaveBeenCalledWith({
      sub: storedToken.user_id,
      email: 'jane@example.com',
      session_id: storedToken.session_id,
    });
    expect(tokenFunctionalRepository.generateRefreshToken).toHaveBeenCalledWith({
      sub: storedToken.user_id,
      email: 'jane@example.com',
      session_id: storedToken.session_id,
    });
    expect(tokenStorageRepository.rotateToken).toHaveBeenCalledWith(
      storedToken.id,
      expect.objectContaining({
        user_id: storedToken.user_id,
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        session_id: storedToken.session_id,
        is_revoked: false,
      }),
    );
    expect(updateUserUseCase.execute).toHaveBeenCalledWith(storedToken.user_id, {
      session_id: storedToken.session_id,
      refresh_token: 'new-refresh-token',
    });
  });

  it('rejects reused refresh tokens when another request already rotated the token', async () => {
    const { useCase, tokenStorageRepository } = createUseCase();
    tokenStorageRepository.rotateToken.mockResolvedValue(null);

    await expect(useCase.execute('old-refresh-token', true)).rejects.toBeInstanceOf(
      TokenAlreadyUsedException,
    );
  });

  it('stores the new access token when refresh token rotation is disabled', async () => {
    const { useCase, tokenStorageRepository } = createUseCase();

    const result = await useCase.execute('old-refresh-token', false);

    expect(result).toEqual({
      access_token: 'new-access-token',
      refresh_token: undefined,
    });
    expect(tokenStorageRepository.rotateToken).not.toHaveBeenCalled();
    expect(tokenStorageRepository.updateToken).toHaveBeenCalledWith(
      expect.objectContaining({
        id: storedToken.id,
        user_id: storedToken.user_id,
        access_token: 'new-access-token',
        refresh_token: 'old-refresh-token',
        session_id: storedToken.session_id,
        is_revoked: false,
        expires_at: expect.any(Date),
      }),
    );
  });
});
