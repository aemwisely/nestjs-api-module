import { UserController } from './user.controller';

describe('UserController', () => {
  const getUserUseCase = {
    getAllEntity: jest.fn(),
    getOneEntity: jest.fn(),
  };
  const createUserUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('wraps create results in a result object', async () => {
    const controller = new UserController(getUserUseCase as any, createUserUseCase as any);
    const dto = {
      email: 'jane@example.com',
      first_name: 'Jane',
      last_name: 'Doe',
      password: 'secret',
      role_id: 'role-1',
      is_active: true,
    };
    createUserUseCase.execute.mockResolvedValue({ id: 'user-1' });

    const result = await controller.createUser(dto as any);

    expect(createUserUseCase.execute).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ result: { id: 'user-1' } });
  });

  it('wraps get-all results in a result object', async () => {
    const controller = new UserController(getUserUseCase as any, createUserUseCase as any);
    getUserUseCase.getAllEntity.mockResolvedValue([{ id: 'user-1' }]);

    const result = await controller.findAll();

    expect(result).toEqual({ result: [{ id: 'user-1' }] });
  });

  it('wraps get-one results in a result object', async () => {
    const controller = new UserController(getUserUseCase as any, createUserUseCase as any);
    getUserUseCase.getOneEntity.mockResolvedValue({ id: 'user-1' });

    const result = await controller.findOne('user-1');

    expect(getUserUseCase.getOneEntity).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({ result: { id: 'user-1' } });
  });
});
