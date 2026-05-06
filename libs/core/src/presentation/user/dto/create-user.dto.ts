import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  is_active: boolean;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  role_id: string;
}
