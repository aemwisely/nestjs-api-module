import { IncorrectPasswordException } from '@libs/common/exception';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  const user = {
    id: '019b02b0-0000-7000-8000-000000000001',
    email: 'jane@example.com',
    getPassword: jest.fn().mockReturnValue('hashed-password'),
    getPayload: jest.fn().mockReturnValue({
      sub: '019b02b0-0000-7000-8000-000000000001',
      email: 'jane@example.com',
      session_id: '019b02b0-0000-7000-8000-000000000002',
    }),
  };

  function createUseCase() {
    const tokenRepository = {
      generateAccessToken: jest.fn().mockResolvedValue('access-token'),
      generateRefreshToken: jest.fn().mockResolvedValue('refresh-token'),
    };
    const tokenStorageRepository = {
      saveToken: jest.fn().mockResolvedValue(undefined),
    };
    const getUserUseCase = {
      getOneByEmail: jest.fn().mockResolvedValue(user),
    };
    const updateUserUseCase = {
      execute: jest.fn().mockResolvedValue(true),
    };
    const hasher = {
      compare: jest.fn().mockResolvedValue(true),
    };

    return {
      useCase: new LoginUseCase(
        tokenRepository as any,
        tokenStorageRepository as any,
        getUserUseCase as any,
        updateUserUseCase as any,
        hasher as any,
      ),
      tokenRepository,
      tokenStorageRepository,
      getUserUseCase,
      updateUserUseCase,
      hasher,
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stores generated login tokens in token table storage', async () => {
    const { useCase, tokenStorageRepository, updateUserUseCase } = createUseCase();

    const response = await useCase.execute('jane@example.com', 'password');

    expect(response).toEqual({
      access_token: 'access-token',
      refresh_token: 'refresh-token',
    });
    expect(tokenStorageRepository.saveToken).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: user.id,
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        session_id: expect.any(String),
        is_revoked: false,
        expires_at: expect.any(Date),
        refresh_expires_at: expect.any(Date),
      }),
    );
    expect(updateUserUseCase.execute).toHaveBeenCalledWith(user.id, {
      session_id: expect.any(String),
      refresh_token: 'refresh-token',
    });
  });

  it('does not store tokens when password is incorrect', async () => {
    const { useCase, tokenStorageRepository, hasher } = createUseCase();
    hasher.compare.mockResolvedValue(false);

    await expect(useCase.execute('jane@example.com', 'wrong-password')).rejects.toBeInstanceOf(
      IncorrectPasswordException,
    );
    expect(tokenStorageRepository.saveToken).not.toHaveBeenCalled();
  });
});
