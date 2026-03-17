import { JwtGuard } from '@libs/common/authentication';
import { CreateUserUseCase, GetUserUseCase } from '@libs/core/application';
import { CreateUserDto } from '@libs/core/presentation';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User-management')
@UseGuards(JwtGuard)
@ApiBearerAuth()
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
