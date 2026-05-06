import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Human-readable grouping key, e.g. user-management' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Route permission code, e.g. GET:/user/:id' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
