import { ApiProperty } from '@nestjs/swagger';

/**
 * Token Response DTO
 * Response containing access and refresh tokens
 */
export class TokenResponseDto {
  @ApiProperty({
    description: 'Access token (JWT) - valid for 15 minutes',
  })
  access_token: string;

  @ApiProperty({
    description: 'Refresh token (JWT) - valid for 3 days. Optional if not renewed',
    required: false,
  })
  refresh_token?: string;

  @ApiProperty({
    description: 'Token type (Bearer)',
    default: 'Bearer',
  })
  token_type: string = 'Bearer';

  @ApiProperty({
    description: 'Expiration time in seconds',
  })
  expires_in: number;
}
