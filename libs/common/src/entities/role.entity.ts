import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from '../base';
import { RoleMenuEntity } from './role-menu.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'role' })
export class RoleEntity extends CommonEntity {
  constructor(partial: Partial<RoleEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column()
  title: string;

  @Column()
  is_active: boolean;

  @Column()
  created_by_id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by_id' })
  created_by: UserEntity;

  @Column()
  updated_by_id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updated_by_id' })
  updated_by: UserEntity;

  @OneToMany(() => RoleMenuEntity, (roleMenu) => roleMenu.role)
  role_menus: RoleMenuEntity[];
}
