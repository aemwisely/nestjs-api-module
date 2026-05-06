import { PermissionLevel } from '@libs/common/entities';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpsertRoleMenuPermissionDto {
  @ApiProperty({ enum: PermissionLevel })
  @IsEnum(PermissionLevel)
  permission: PermissionLevel;
}
