import { CreateUserUseCase } from './create-user.use-case';
import { UserModel } from '@libs/core/domain';

describe('CreateUserUseCase', () => {
  it('hashes the password, saves the user, and returns a mapped entity', async () => {
    const repository = {
      save: jest.fn(),
    };
    const hasher = {
      hash: jest.fn().mockResolvedValue('hashed-password'),
    };
    const useCase = new CreateUserUseCase(repository as any, hasher as any);
    const savedUser = UserModel.toDomain({
      id: 'user-1',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@example.com',
      password: 'hashed-password',
      is_active: true,
      role_id: 'role-1',
    });

    repository.save.mockResolvedValue(savedUser);

    const result = await useCase.execute({
      email: 'jane@example.com',
      first_name: 'Jane',
      last_name: 'Doe',
      password: 'plain-password',
      role_id: 'role-1',
      is_active: true,
    });

    expect(hasher.hash).toHaveBeenCalledWith('plain-password');
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        password: 'hashed-password',
        role_id: 'role-1',
        is_active: true,
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 'user-1',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        is_active: true,
      }),
    );
  });
});
