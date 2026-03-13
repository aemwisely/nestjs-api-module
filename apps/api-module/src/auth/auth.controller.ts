import { JwtGuard } from '@libs/common/authentication';
import { Context, IContext } from '@libs/common/decorator';
import { LoginUseCase } from '@libs/core/application/auth';
import { LoginDto } from '@libs/core/infrastructure';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('authentication')
@ApiTags('Authentication')
export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  @Post('/login')
  async login(@Body() dto: LoginDto) {
    const data = await this.loginUseCase.execute(dto.email, dto.password);
    return {
      result: data,
    };
  }

  @Get('/self')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async getSelf(@Context() _context: IContext) {}
}
