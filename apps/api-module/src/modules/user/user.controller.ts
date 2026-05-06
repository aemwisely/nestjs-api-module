import { JwtGuard } from '@libs/common/authentication';
import { CreateUserUseCase, GetUserUseCase } from '@libs/core/application';
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
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

@Controller('user')
@ApiTags('User-management')
@UseGuards(JwtGuard)
@ApiBearerAuth()
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
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() query: PaginationQueryDto) {
    try {
      const { page = 1, limit = 10 } = query;
      const offset = (page - 1) * limit;

      // Note: This assumes the use case supports pagination.
      // In a real implementation, you might need to modify GetUserUseCase
      // to accept pagination parameters.
      const data = await this.usecaseGetUser.getAllEntity();

      // Simple pagination implementation (for demo)
      // In production, implement proper pagination in repository layer
      const paginatedData = data.slice(offset, offset + limit);
      const total = data.length;

      return {
        result: paginatedData,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
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
