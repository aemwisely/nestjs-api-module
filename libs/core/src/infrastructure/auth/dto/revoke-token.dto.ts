import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

/**
 * Revoke Token Request DTO
 * Used to revoke tokens (logout)
 */
export class RevokeTokenDto {
  @ApiProperty({
    description: 'Token ID to revoke (optional). If not provided, revokes current token',
    required: false,
  })
  @IsOptional()
  token_id?: string;

  @ApiProperty({
    description: 'If true, revoke all tokens for the user (logout from all devices)',
    required: false,
    default: false,
  })
  @IsOptional()
  revoke_all?: boolean = false;
}
