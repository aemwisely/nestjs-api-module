import { LoginUseCase } from '@libs/core/application/auth';
import { LoginDto } from '@libs/core/infrastructure';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

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
}
