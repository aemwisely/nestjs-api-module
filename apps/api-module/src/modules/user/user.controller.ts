import { JwtGuard } from '@libs/common/authentication';
import { JWT_ACCESS_TOKEN } from '@libs/common/config/swagger';
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
import { CommonFilter } from '@libs/common/base';

@Controller('user')
@ApiTags('User-management')
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
    try {
      const data = await this.usecaseCreateUser.execute(body);

      return {
        result: data,
      };
    } catch (error) {
      // Error handling can be improved with proper exception filters
      throw error;
    }
  }

  /**
   * Get all users with pagination
   * @param query - Pagination parameters
   * @returns Paginated list of users
   */
  @Get('/')
  async findAll(@Query() query: CommonFilter) {
    try {
      const { page, limit, getPageCount } = query;

      // Note: This assumes the use case supports pagination.
      // In a real implementation, you might need to modify GetUserUseCase
      // to accept pagination parameters.
      const [data, count] = await this.usecaseGetUser.findAllEntityWithPagination(query);

      return {
        result: data,
        pagination: {
          page,
          limit,
          count,
          page_count: getPageCount(limit, count),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a user by ID
   * @param id - The user ID
   * @returns The user data
   */
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.usecaseGetUser.getOneEntity(id);

      return {
        result: data,
      };
    } catch (error) {
      throw error;
    }
  }
}
