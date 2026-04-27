import { UserIdNotFoundException } from '@libs/common';
import { UserModel } from '@libs/core/domain';
import { UpdateUserUseCase } from './update-user.use-case';

describe('UpdateUserUseCase', () => {
  const repository = {
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates an existing user', async () => {
    const useCase = new UpdateUserUseCase(repository as any);
    repository.findById.mockResolvedValue(
      UserModel.toDomain({
        id: 'user-1',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        password: 'secret',
        is_active: true,
        role_id: 'role-1',
      }),
    );
    repository.update.mockResolvedValue(true);

    const result = await useCase.execute('user-1', { first_name: 'Janet' });

    expect(repository.update).toHaveBeenCalledWith('user-1', { first_name: 'Janet' });
    expect(result).toBe(true);
  });

  it('throws when the target user is missing', async () => {
    const useCase = new UpdateUserUseCase(repository as any);
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing', { first_name: 'Janet' })).rejects.toBeInstanceOf(
      UserIdNotFoundException,
    );
  });
});
