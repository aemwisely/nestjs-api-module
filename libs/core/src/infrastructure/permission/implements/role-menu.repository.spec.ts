import { PermissionLevel } from '@libs/common/entities';
import { PermissionAction } from '@libs/core/domain';
import { RoleMenuRepository } from './role-menu.repository';

describe('RoleMenuRepository', () => {
  it('finds permission decisions only through active role and active menu records', async () => {
    const queryBuilder = {
      innerJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      setParameter: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({
        permission: PermissionLevel.ALL,
        menu_id: 1,
        menu_code: '01',
      }),
    };
    const roleMenuTypeormRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };
    const repository = new RoleMenuRepository(roleMenuTypeormRepository as any);

    const result = await repository.findPermissionDecision({
      role_id: 'role-id',
      module_code: '01',
      required_permission: 'READ' as PermissionAction,
    });

    expect(result).toEqual({
      permission: PermissionLevel.ALL,
      menu_id: 1,
      menu_code: '01',
    });
    expect(roleMenuTypeormRepository.createQueryBuilder).toHaveBeenCalledWith('role_menu');
    expect(queryBuilder.innerJoin).toHaveBeenCalledWith('role_menu.menu', 'menu');
    expect(queryBuilder.innerJoin).toHaveBeenCalledWith('role_menu.role', 'role');
    expect(queryBuilder.where).toHaveBeenCalledWith('role_menu.role_id = :roleId', {
      roleId: 'role-id',
    });
    expect(queryBuilder.andWhere).toHaveBeenCalledWith('menu.is_active = true');
    expect(queryBuilder.andWhere).toHaveBeenCalledWith('role.is_active = true');
    expect(queryBuilder.andWhere).toHaveBeenCalledWith('menu.code = :moduleCode', {
      moduleCode: '01',
    });
    expect(queryBuilder.setParameter).toHaveBeenCalledWith('requiredPermission', 'READ');
  });
});
