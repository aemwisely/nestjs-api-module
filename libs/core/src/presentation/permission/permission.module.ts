import { MenuEntity, RoleEntity, RoleMenuEntity } from '@libs/common/entities';
import {
  CheckRoleMenuPermissionUseCase,
  CreateMenuUseCase,
  CreateRoleUseCase,
  GetMenuUseCase,
  GetRoleMenuUseCase,
  GetRoleUseCase,
  MenuFunctionalRepository,
  RoleFunctionalRepository,
  RoleMenuFunctionalRepository,
  UpsertRoleMenuPermissionUseCase,
} from '@libs/core/application/permission';
import { MenuRepository, RoleMenuRepository, RoleRepository } from '@libs/core/infrastructure';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGuard } from './permission.guard';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, MenuEntity, RoleMenuEntity])],
  providers: [
    {
      provide: RoleFunctionalRepository,
      useClass: RoleRepository,
    },
    {
      provide: MenuFunctionalRepository,
      useClass: MenuRepository,
    },
    {
      provide: RoleMenuFunctionalRepository,
      useClass: RoleMenuRepository,
    },
    CreateRoleUseCase,
    GetRoleUseCase,
    CreateMenuUseCase,
    GetMenuUseCase,
    UpsertRoleMenuPermissionUseCase,
    GetRoleMenuUseCase,
    CheckRoleMenuPermissionUseCase,
    PermissionGuard,
  ],
  exports: [
    CreateRoleUseCase,
    GetRoleUseCase,
    CreateMenuUseCase,
    GetMenuUseCase,
    UpsertRoleMenuPermissionUseCase,
    GetRoleMenuUseCase,
    CheckRoleMenuPermissionUseCase,
    PermissionGuard,
  ],
})
export class PermissionCoreModule {}
