import { Column, Entity, Index } from 'typeorm';
import { CommonEntity } from '@libs/common/base';

@Entity({ name: 'action_log' })
@Index(['account_id'])
@Index(['method'])
@Index(['path'])
@Index(['created_at'])
export class ActionLogEntity extends CommonEntity {
  constructor(partial: Partial<ActionLogEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'uuid', nullable: true })
  account_id: string | null;

  @Column({ type: 'varchar', nullable: true })
  account_email: string | null;

  @Column({ type: 'text', nullable: false })
  action: string;

  @Column({ type: 'varchar', nullable: false })
  method: string;

  @Column({ type: 'text', nullable: false })
  path: string;

  @Column({ type: 'varchar', nullable: true })
  ip_address: string | null;

  @Column({ type: 'text', nullable: true })
  browser: string | null;

  @Column({ type: 'int', nullable: true })
  status_code: number | null;

  @Column({ type: 'jsonb', nullable: true })
  request_body: unknown;

  @Column({ type: 'jsonb', nullable: true })
  request_params: unknown;

  @Column({ type: 'jsonb', nullable: true })
  request_query: unknown;
}
