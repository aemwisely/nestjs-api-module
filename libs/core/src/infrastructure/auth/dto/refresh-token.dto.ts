import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

/**
 * Refresh Token Request DTO
 * Used to refresh access token using refresh token
 */
export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token from login response',
    required: true,
  })
  @IsNotEmpty()
  refresh_token: string;

  @ApiProperty({
    description: 'Whether to renew the refresh token (rotation)',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  renew_refresh_token?: boolean = true;
}
