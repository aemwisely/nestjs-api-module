import { CreateUserDto, CreateUserUseCase, GetUserUseCase } from '@libs/core/application';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user-management')
export class UserController {
  constructor(
    private useGetUser: GetUserUseCase,
    private useCreateUser: CreateUserUseCase,
  ) {}

  @Post('/')
  async createUser(@Body() body: CreateUserDto) {
    const data = await this.useCreateUser.execute(body);

    return {
      result: data,
    };
  }

  @Get('/')
  async findAll() {
    const data = await this.useGetUser.getAll();

    return {
      result: data,
    };
  }
}
