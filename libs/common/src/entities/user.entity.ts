import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from '../base';
import { RoleEntity } from './role.entity';

@Entity({ name: 'user' })
export class UserEntity extends CommonEntity {
  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }

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

  @Column()
  session_id: string;

  @Column()
  refresh_token: string;

  @ManyToOne(() => RoleEntity)
  role: RoleEntity;

  @Column()
  role_id: string;
}
