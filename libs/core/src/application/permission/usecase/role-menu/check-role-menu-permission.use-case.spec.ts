import { PermissionLevel } from '@libs/common/entities';
import { RoleMenuFunctionalRepository } from '../../ports';
import { CheckRoleMenuPermissionUseCase } from './check-role-menu-permission.use-case';

describe('CheckRoleMenuPermissionUseCase', () => {
  it('allows when a role has ALL permission for the matched module code', async () => {
    const repository = {
      findPermissionDecision: jest.fn().mockResolvedValue({
        permission: PermissionLevel.ALL,
        menu_id: 1,
        menu_code: '01',
      }),
    } as unknown as RoleMenuFunctionalRepository;
    const useCase = new CheckRoleMenuPermissionUseCase(repository);

    const result = await useCase.execute({
      role_id: 'role-id',
      method: 'GET',
      module_code: '01',
    });

    expect(result.allowed).toBe(true);
    expect(repository.findPermissionDecision).toHaveBeenCalledWith({
      role_id: 'role-id',
      module_code: '01',
      required_permission: 'READ',
    });
  });

  it('denies by default when no menu permission is configured', async () => {
    const repository = {
      findPermissionDecision: jest.fn().mockResolvedValue(null),
    } as unknown as RoleMenuFunctionalRepository;
    const useCase = new CheckRoleMenuPermissionUseCase(repository);

    const result = await useCase.execute({
      role_id: 'role-id',
      method: 'POST',
      module_code: '01',
    });

    expect(result).toEqual({
      allowed: false,
      required_permission: 'WRITE',
      matched_menu_code: undefined,
    });
  });
});
