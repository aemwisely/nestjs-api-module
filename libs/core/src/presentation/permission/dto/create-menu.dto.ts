import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Human-readable grouping key, e.g. user-management' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Module code from EModule/ErrorMessage.md, e.g. 01 for User' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ name: 'is_active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
