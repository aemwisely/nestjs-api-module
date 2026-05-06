import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

/**
 * Refresh Token Request DTO
 * Used to refresh access token using refresh token
 */
export class RefreshTokenDto {
  @ApiProperty({
    name: 'refresh_token',
    description: 'Refresh token from login response',
    required: true,
  })
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty({
    name: 'renew_refresh_token',
    description: 'Whether to renew the refresh token (rotation)',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  renewRefreshToken?: boolean = true;
}
