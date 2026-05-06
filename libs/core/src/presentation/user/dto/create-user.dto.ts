import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ name: 'is_active', required: true })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty({ name: 'first_name', required: true })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ name: 'last_name', required: true })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ name: 'role_id', required: true })
  @IsString()
  @IsNotEmpty()
  roleId: string;
}
