import { UserUnauthorizedException } from '@libs/common';
import { GetSelfUseCase } from './get-self.use-case';

describe('GetSelfUseCase', () => {
  const getUserUseCase = {
    getOneEntity: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the authenticated user entity', async () => {
    const useCase = new GetSelfUseCase(getUserUseCase as any);
    const entity = { id: 'user-1', email: 'jane@example.com' };
    getUserUseCase.getOneEntity.mockResolvedValue(entity);

    const result = await useCase.execute({ sub: 'user-1', email: 'jane@example.com' });

    expect(getUserUseCase.getOneEntity).toHaveBeenCalledWith('user-1');
    expect(result).toBe(entity);
  });

  it('throws when the authenticated user cannot be loaded', async () => {
    const useCase = new GetSelfUseCase(getUserUseCase as any);
    getUserUseCase.getOneEntity.mockResolvedValue(null);

    await expect(
      useCase.execute({ sub: 'user-1', email: 'jane@example.com' }),
    ).rejects.toBeInstanceOf(UserUnauthorizedException);
  });
});
