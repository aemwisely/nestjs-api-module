export interface IQueryBuilder<T> {
  where(condition: string, params?: any): this;
  andWhere(condition: string, params?: any): this;
  leftJoin(relation: string, alias: string): this;
  leftJoinAndSelect(relation: string, alias: string): this;
  getOne(): Promise<T | null>;
  skip(int?: number): this;
  take(take?: number): this;
  getMany(): Promise<T[]>;
  getManyAndCount(): Promise<[T[], number]>;
}
