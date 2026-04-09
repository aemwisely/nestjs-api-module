import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../base';

@Entity({ name: 'media_object' })
export class MediaObjectEntity extends CommonEntity {
  constructor(partial: Partial<MediaObjectEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column()
  name: string;

  @Column()
  mimetype: string;

  @Column()
  url: string;

  @Column()
  bucket: string;

  @Column({ type: 'timestamptz' })
  expire_date: Date;

  @Column()
  is_public: boolean;

  @Column()
  key: string;
}
