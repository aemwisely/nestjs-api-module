import { JwtGuard } from '@libs/common/authentication';
import { JWT_ACCESS_TOKEN } from '@libs/common/config/swagger';
import { Context, IContext } from '@libs/common/decorator';
import {
  CreateMenuUseCase,
  CreateRoleUseCase,
  GetMenuUseCase,
  GetRoleMenuUseCase,
  GetRoleUseCase,
  UpsertRoleMenuPermissionUseCase,
} from '@libs/core/application/permission';
import {
  CreateMenuDto,
  CreateRoleDto,
  PermissionGuard,
  UpsertRoleMenuPermissionDto,
} from '@libs/core/presentation';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('permission')
@ApiTags('Permission')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth(JWT_ACCESS_TOKEN)
export class PermissionController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getRoleUseCase: GetRoleUseCase,
    private readonly createMenuUseCase: CreateMenuUseCase,
    private readonly getMenuUseCase: GetMenuUseCase,
    private readonly upsertRoleMenuPermissionUseCase: UpsertRoleMenuPermissionUseCase,
    private readonly getRoleMenuUseCase: GetRoleMenuUseCase,
  ) {}

  @Post('/roles')
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() body: CreateRoleDto, @Context() context: IContext) {
    const data = await this.createRoleUseCase.execute({
      ...body,
      created_by_id: context.sub,
      updated_by_id: context.sub,
    });

    return { result: data };
  }

  @Get('/roles')
  async getRoles() {
    const data = await this.getRoleUseCase.findAll();
    return { result: data };
  }

  @Post('/menus')
  @HttpCode(HttpStatus.CREATED)
  async createMenu(@Body() body: CreateMenuDto) {
    const data = await this.createMenuUseCase.execute(body);
    return { result: data };
  }

  @Get('/menus')
  async getMenus() {
    const data = await this.getMenuUseCase.findAll();
    return { result: data };
  }

  @Get('/roles/:roleId/menus')
  async getRoleMenus(@Param('roleId') roleId: string) {
    const data = await this.getRoleMenuUseCase.findAllByRole(roleId);
    return { result: data };
  }

  @Put('/roles/:roleId/menus/:menuId')
  async upsertRoleMenuPermission(
    @Param('roleId') roleId: string,
    @Param('menuId', ParseIntPipe) menuId: number,
    @Body() body: UpsertRoleMenuPermissionDto,
    @Context() context: IContext,
  ) {
    const data = await this.upsertRoleMenuPermissionUseCase.execute({
      role_id: roleId,
      menu_id: menuId,
      permission: body.permission,
      updated_by_id: context.sub,
    });

    return { result: data };
  }
}
