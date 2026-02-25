import { UserEntity } from '@libs/common/entities';
import { UserFunctionalRepository } from '@libs/core/application';
import { UserModel } from '@libs/core/domain';
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
  }): UserModel {
    return UserModel.create(body);
  }

  async save(user: UserModel): Promise<void> {
    await this.repository.save({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.getPassword(),
      is_active: user.is_active,
    });

    return;
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
    const queryBuilder = this.repository.createQueryBuilder('user');

    const response = await queryBuilder.getMany();
    return response.map((entity) => UserModel.toDomain(entity));
  }

  useQueryBuilder(): SelectQueryBuilder<UserEntity> {
    return this.repository.createQueryBuilder('user');
  }
}
