import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../base';
import { MenuEntity } from './menu.entity';
import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

export enum PermissionLevel {
  ALL = 'ALL',
  READ = 'READ',
  WRITE = 'WRITE',
  NONE = 'NONE',
}

@Entity({ name: 'role_menu' })
@Index('idx_role_menu_lookup', ['role_id', 'menu_id'])
@Index('uq_role_menu_role_menu', ['role_id', 'menu_id'], { unique: true })
export class RoleMenuEntity extends DefaultEntity {
  constructor(partial?: Partial<RoleMenuEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column()
  role_id: string;

  @ManyToOne(() => RoleEntity, (role) => role.role_menus)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @Column()
  menu_id: number;

  @ManyToOne(() => MenuEntity, (menu) => menu.role_menus)
  @JoinColumn({ name: 'menu_id' })
  menu: MenuEntity;

  @Column({ type: 'varchar', length: 100 })
  permission: PermissionLevel;

  @Column()
  updated_by_id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updated_by_id' })
  updated_by: UserEntity;
}
