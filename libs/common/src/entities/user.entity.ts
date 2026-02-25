import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../base';

@Entity({ name: 'user' })
export class UserEntity extends CommonEntity {
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  is_active: boolean;
}
