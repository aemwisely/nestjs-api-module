import { UserEmailNotFoundException, UserIdNotFoundException } from '@libs/common/exception';
import { UserModel } from '@libs/core/domain';
import { GetUserUseCase } from './get-user.use-case';

describe('GetUserUseCase', () => {
  const repository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
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

  it('returns all users mapped as entities', async () => {
    const useCase = new GetUserUseCase(repository as any);
    repository.findAll.mockResolvedValue([makeUser()]);

    const result = await useCase.getAllEntity();

    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual([
      expect.objectContaining({
        id: 'user-1',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        is_active: true,
      }),
    ]);
  });

  it('returns one mapped entity by id', async () => {
    const useCase = new GetUserUseCase(repository as any);
    repository.findById.mockResolvedValue(makeUser());

    const result = await useCase.getOneEntity('user-1');

    expect(repository.findById).toHaveBeenCalledWith('user-1');
    expect(result).toEqual(
      expect.objectContaining({
        id: 'user-1',
        first_name: 'Jane',
        email: 'jane@example.com',
      }),
    );
  });

  it('throws when a user id is not found', async () => {
    const useCase = new GetUserUseCase(repository as any);
    repository.findById.mockResolvedValue(null);

    await expect(useCase.getOneEntity('missing')).rejects.toBeInstanceOf(UserIdNotFoundException);
  });

  it('returns the domain user by email', async () => {
    const useCase = new GetUserUseCase(repository as any);
    const user = makeUser();
    repository.findByEmail.mockResolvedValue(user);

    const result = await useCase.getOneByEmail('jane@example.com');

    expect(result).toBe(user);
  });

  it('throws when an email is not found', async () => {
    const useCase = new GetUserUseCase(repository as any);
    repository.findByEmail.mockResolvedValue(null);

    await expect(useCase.getOneByEmail('missing@example.com')).rejects.toBeInstanceOf(
      UserEmailNotFoundException,
    );
  });
});
