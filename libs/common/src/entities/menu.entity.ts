import { Column, Entity, Index, OneToMany } from 'typeorm';
import { DefaultEntity } from '../base';
import { RoleMenuEntity } from './role-menu.entity';

@Entity({ name: 'menu' })
@Index('idx_menu_code_active', ['code', 'is_active'])
@Index('idx_menu_key_active', ['key', 'is_active'])
export class MenuEntity extends DefaultEntity {
  constructor(partial?: Partial<MenuEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column()
  title: string;

  @Column()
  key: string;

  @Column()
  is_active: boolean;

  @Column()
  code: string;

  @OneToMany(() => RoleMenuEntity, (roleMenu) => roleMenu.menu)
  role_menus: RoleMenuEntity[];
}
