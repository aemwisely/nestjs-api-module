import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  is_active: boolean;

  @ApiProperty({ required: true })
  first_name: string;

  @ApiProperty({ required: true })
  last_name: string;

  @ApiProperty({ required: true })
  password: string;

  @ApiProperty({ required: true })
  role_id: string;
}
