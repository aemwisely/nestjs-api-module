import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class CommonFilter {
  @ApiProperty({ required: false, default: 1 })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiProperty({ required: false, default: true })
  @Transform(({ value }) => (typeof value === 'boolean' ? value : value !== 'false'))
  @IsOptional()
  @IsBoolean()
  pagination: boolean = true;

  getOffset(value: CommonFilter): number {
    return (value.page - 1) * value.limit;
  }

  getPageCount(limit: number, total: number) {
    return Math.ceil(total / limit);
  }
}
