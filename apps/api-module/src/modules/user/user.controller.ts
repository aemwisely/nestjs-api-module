import { CreateUserDto, CreateUserUseCase, GetUserUseCase } from '@libs/core/application';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User-management')
export class UserController {
  constructor(
    private usecaseGetUser: GetUserUseCase,
    private usecaseCreateUser: CreateUserUseCase,
  ) {}

  @Post('/')
  async createUser(@Body() body: CreateUserDto) {
    const data = await this.usecaseCreateUser.execute(body);

    return {
      result: data,
    };
  }

  @Get('/')
  async findAll() {
    const data = await this.usecaseGetUser.getAllEntity();

    return {
      result: data,
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.usecaseGetUser.getOneEntity(id);

    return {
      result: data,
    };
  }
}
