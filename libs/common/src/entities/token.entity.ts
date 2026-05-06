import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '@libs/common/base';
import { UserEntity } from '@libs/common/entities';

@Entity({ name: 'token' })
@Index(['user_id'])
@Index(['session_id'])
@Index(['access_token'])
@Index(['refresh_token'])
@Index(['is_revoked'])
@Index(['expires_at'])
export class TokenEntity extends CommonEntity {
  constructor(partial: Partial<TokenEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column('uuid')
  user_id: string;

  @Column('text')
  access_token: string;

  @Column('text')
  refresh_token: string;

  @Column('uuid')
  session_id: string;

  @Column({ default: false })
  is_revoked: boolean;

  @Column('timestamp with time zone')
  expires_at: Date;

  @Column('timestamp with time zone')
  refresh_expires_at: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
