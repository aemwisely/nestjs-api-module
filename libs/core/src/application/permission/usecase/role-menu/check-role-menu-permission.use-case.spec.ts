import { PermissionLevel } from '@libs/common/entities';
import { RoleMenuFunctionalRepository } from '../../ports';
import { CheckRoleMenuPermissionUseCase } from './check-role-menu-permission.use-case';

describe('CheckRoleMenuPermissionUseCase', () => {
  it('allows when a role has ALL permission for the matched route code', async () => {
    const repository = {
      findPermissionDecision: jest.fn().mockResolvedValue({
        permission: PermissionLevel.ALL,
        menu_id: 1,
        menu_code: 'GET:/user/:id',
      }),
    } as unknown as RoleMenuFunctionalRepository;
    const useCase = new CheckRoleMenuPermissionUseCase(repository);

    const result = await useCase.execute({
      role_id: 'role-id',
      method: 'GET',
      route_path: '/user/:id',
      request_path: '/user/123',
    });

    expect(result.allowed).toBe(true);
    expect(repository.findPermissionDecision).toHaveBeenCalledWith({
      role_id: 'role-id',
      menu_codes: ['GET:/user/:id', 'GET:/user/123', '/user/:id', '/user/123'],
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
      route_path: '/user',
      request_path: '/user',
    });

    expect(result).toEqual({
      allowed: false,
      required_permission: 'WRITE',
      matched_menu_code: undefined,
    });
  });
});
