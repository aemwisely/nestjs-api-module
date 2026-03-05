export interface IUserQueryBuilder<T> {
  where(condition: string, params?: any): this;
  andWhere(condition: string, params?: any): this;
  leftJoin(relation: string, alias: string): this;
  getOne(): Promise<T | null>;
  getMany(): Promise<T[]>;
}
