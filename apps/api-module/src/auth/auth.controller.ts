import { JwtGuard } from '@libs/common/authentication';
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from '@libs/common/config/swagger';
import { Context, IContext, AccessToken, PermissionModuleCode } from '@libs/common/decorator';
import { EModule } from '@libs/common/exception';
import {
  GetSelfUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  RevokeTokenUseCase,
  RenewTokenUseCase,
} from '@libs/core/application/auth';
import {
  LoginDto,
  RefreshTokenDto,
  RevokeTokenDto,
  TokenResponseDto,
} from '@libs/core/infrastructure';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { PermissionGuard } from '@libs/core/presentation';

/**
 * Authentication Controller
 * Handles all authentication related endpoints
 * - Login: Generate access and refresh tokens
 * - Refresh: Get new access token using refresh token
 * - Renew: Rotate tokens for security
 * - Revoke: Logout and revoke tokens
 * - Get Self: Get current user information
 */
@Controller('authentication')
@ApiTags('Authentication')
@PermissionModuleCode(EModule.AUTH)
export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private getSelfUseCase: GetSelfUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private revokeTokenUseCase: RevokeTokenUseCase,
    private renewTokenUseCase: RenewTokenUseCase,
  ) {}

  /**
   * Login endpoint
   * Authenticates user and returns access and refresh tokens
   */
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TokenResponseDto })
  async login(@Body() dto: LoginDto) {
    const data = await this.loginUseCase.execute(dto.email, dto.password);
    return {
      result: {
        ...data,
        token_type: 'Bearer',
        expires_in: 15 * 60, // 15 minutes in seconds
      },
    };
  }

  /**
   * Refresh Token endpoint
   * Get new access token using refresh token
   * Optionally rotate refresh token for enhanced security
   */
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth(JWT_REFRESH_TOKEN)
  @ApiOkResponse({ type: TokenResponseDto })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    const data = await this.refreshTokenUseCase.execute(
      dto.refresh_token,
      dto.renew_refresh_token ?? true,
    );
    return {
      result: {
        ...data,
        token_type: 'Bearer',
        expires_in: 15 * 60, // 15 minutes in seconds
      },
    };
  }

  /**
   * Revoke Token endpoint (Logout)
   * Revoke current token or all tokens for the user
   */
  @Post('/revoke')
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth(JWT_ACCESS_TOKEN)
  @HttpCode(HttpStatus.OK)
  async revokeToken(
    @Body() dto: RevokeTokenDto,
    @Context() context: IContext,
    @AccessToken() accessToken: string,
  ) {
    if (dto.revoke_all) {
      await this.revokeTokenUseCase.revokeAllUserTokens(context);
      return {
        result: { message: 'All tokens revoked successfully' },
      };
    } else if (dto.token_id) {
      await this.revokeTokenUseCase.revokeToken(dto.token_id, context);
      return {
        result: { message: 'Token revoked successfully' },
      };
    } else {
      await this.revokeTokenUseCase.revokeCurrentToken(accessToken, context);
      return {
        result: { message: 'Logged out successfully' },
      };
    }
  }

  /**
   * Renew Token endpoint
   * Rotate tokens for security purposes
   * Invalidates old token and issues new one
   */
  @Post('/renew')
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth(JWT_ACCESS_TOKEN)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TokenResponseDto })
  async renewToken(@Context() context: IContext, @AccessToken() accessToken: string) {
    const data = await this.renewTokenUseCase.renewCurrentToken(context, accessToken);
    return {
      result: {
        ...data,
        token_type: 'Bearer',
        expires_in: 15 * 60, // 15 minutes in seconds
      },
    };
  }

  /**
   * Get Self endpoint
   * Get current authenticated user information
   */
  @Get('/self')
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth(JWT_ACCESS_TOKEN)
  @HttpCode(HttpStatus.OK)
  async getSelf(@Context() context: IContext) {
    const data = await this.getSelfUseCase.execute(context);
    return {
      result: data,
    };
  }
}
