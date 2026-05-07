import { JwtGuard } from '@libs/common/authentication';
import { CommonFilter } from '@libs/common/base';
import { JWT_ACCESS_TOKEN } from '@libs/common/config/swagger';
import { PermissionModuleCode } from '@libs/common/decorator';
import { EModule } from '@libs/common/exception';
import { CreateUserUseCase, GetUserUseCase } from '@libs/core/application';
import { PermissionGuard } from '@libs/core/presentation';
import { CreateUserDto } from '@libs/core/presentation';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User-management')
@PermissionModuleCode(EModule.USER)
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth(JWT_ACCESS_TOKEN)
export class UserController {
  constructor(
    private usecaseGetUser: GetUserUseCase,
    private usecaseCreateUser: CreateUserUseCase,
  ) {}

  /**
   * Create a new user
   * @param body - The user data to create
   * @returns The created user data
   */
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateUserDto) {
    const data = await this.usecaseCreateUser.execute(body);

    return {
      result: data,
    };
  }

  /**
   * Get all users with pagination
   * @param query - Pagination parameters
   * @returns Paginated list of users
   */
  @Get('/')
  async findAll(@Query() query: CommonFilter) {
    const { page, limit } = query;

    const [data, count] = await this.usecaseGetUser.findAllEntityWithPagination(query);

    return {
      result: data,
      pagination: {
        page,
        limit,
        count,
        pageCount: query.getPageCount(limit, count),
      },
    };
  }

  /**
   * Get a user by ID
   * @param id - The user ID
   * @returns The user data
   */
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.usecaseGetUser.getOneEntity(id);

    return {
      result: data,
    };
  }
}
