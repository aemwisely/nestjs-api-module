import { ApiProperty } from '@nestjs/swagger';

/**
 * Token Response DTO
 * Response containing access and refresh tokens
 */
export class TokenResponseDto {
  @ApiProperty({
    name: 'access_token',
    description: 'Access token (JWT) - valid for 15 minutes',
  })
  accessToken: string;

  @ApiProperty({
    name: 'refresh_token',
    description: 'Refresh token (JWT) - valid for 3 days. Optional if not renewed',
    required: false,
  })
  refreshToken?: string;

  @ApiProperty({
    name: 'token_type',
    description: 'Token type (Bearer)',
    default: 'Bearer',
  })
  tokenType: string = 'Bearer';

  @ApiProperty({
    name: 'expires_in',
    description: 'Expiration time in seconds',
  })
  expiresIn: number;
}
