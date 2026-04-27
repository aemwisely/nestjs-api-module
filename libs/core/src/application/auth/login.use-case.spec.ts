import { IncorrectPasswordException } from '@libs/common/exception';
import { UserModel } from '@libs/core/domain';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  const tokenRepository = {
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
  };
  const getUserUseCase = {
    getOneByEmail: jest.fn(),
  };
  const updateUserUseCase = {
    execute: jest.fn(),
  };
  const hasher = {
    compare: jest.fn(),
  };

  const makeUser = () =>
    UserModel.toDomain({
      id: 'user-1',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@example.com',
      password: 'hashed-password',
      is_active: true,
      role_id: 'role-1',
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns access and refresh tokens for a valid login', async () => {
    const useCase = new LoginUseCase(
      tokenRepository as any,
      getUserUseCase as any,
      updateUserUseCase as any,
      hasher as any,
    );
    const user = makeUser();

    getUserUseCase.getOneByEmail.mockResolvedValue(user);
    hasher.compare.mockResolvedValue(true);
    tokenRepository.generateAccessToken.mockResolvedValue('access-token');
    tokenRepository.generateRefreshToken.mockResolvedValue('refresh-token');
    updateUserUseCase.execute.mockResolvedValue(true);

    const result = await useCase.execute('jane@example.com', 'plain-password');

    expect(getUserUseCase.getOneByEmail).toHaveBeenCalledWith('jane@example.com');
    expect(hasher.compare).toHaveBeenCalledWith('plain-password', 'hashed-password');
    expect(tokenRepository.generateAccessToken).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: 'user-1',
        email: 'jane@example.com',
        session_id: expect.any(String),
      }),
    );
    expect(updateUserUseCase.execute).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        session_id: expect.any(String),
        refresh_token: 'refresh-token',
      }),
    );
    expect(result).toEqual({
      access_token: 'access-token',
      refresh_token: 'refresh-token',
    });
  });

  it('throws when the password does not match', async () => {
    const useCase = new LoginUseCase(
      tokenRepository as any,
      getUserUseCase as any,
      updateUserUseCase as any,
      hasher as any,
    );

    getUserUseCase.getOneByEmail.mockResolvedValue(makeUser());
    hasher.compare.mockResolvedValue(false);

    await expect(useCase.execute('jane@example.com', 'wrong-password')).rejects.toBeInstanceOf(
      IncorrectPasswordException,
    );
    expect(updateUserUseCase.execute).not.toHaveBeenCalled();
  });
});
