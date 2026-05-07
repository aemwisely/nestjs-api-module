import { UserEntity } from '@libs/common/entities';
import { UserFunctionalRepository } from '@libs/core/application';
import { TUserEntity, UserModel } from '@libs/core/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class UserTypeOrmRepository implements UserFunctionalRepository {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  create(body: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role_id: string;
  }): UserModel {
    return UserModel.create(body);
  }

  async save(user: UserModel): Promise<UserEntity> {
    return await this.repository.save({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.getPassword(),
      is_active: user.is_active,
      role_id: user.role_id,
    });
  }

  async findById(id: string): Promise<UserModel | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return UserModel.toDomain(entity);
  }

  async findAll(): Promise<UserModel[]> {
    const queryBuilder = this.useQueryBuilder();

    const response = await queryBuilder.getMany();
    return response.map((entity) => UserModel.toDomain(entity));
  }

  useQueryBuilder(): SelectQueryBuilder<UserEntity> {
    return this.repository.createQueryBuilder('user');
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const entity = await this.repository.findOne({ where: { email: email } });

    if (!entity) return null;

    return UserModel.toDomain(entity);
  }

  async update(id: string, body: Partial<TUserEntity>): Promise<boolean> {
    try {
      await this.repository.update({ id }, body);
      return true;
    } catch {
      return false;
    }
  }
}
