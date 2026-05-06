import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

/**
 * Revoke Token Request DTO
 * Used to revoke tokens (logout)
 */
export class RevokeTokenDto {
  @ApiProperty({
    name: 'token_id',
    description: 'Token ID to revoke (optional). If not provided, revokes current token',
    required: false,
  })
  @IsOptional()
  tokenId?: string;

  @ApiProperty({
    name: 'revoke_all',
    description: 'If true, revoke all tokens for the user (logout from all devices)',
    required: false,
    default: false,
  })
  @IsOptional()
  revokeAll?: boolean = false;
}
