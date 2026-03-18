

export abstract class RoleFunctionalRepository {
  abstract create(dto: Partial<RoleType>):Promise<>;
}
