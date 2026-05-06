/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateTableRoleMenu1778085591205 {
  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "role_menu" (
        id serial primary key,
        created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
        deleted_at timestamptz NULL,
        role_id uuid references role(id) not null,
        menu_id int4 references menu(id) not null,
        permission varchar(100) not null check (permission in ('ALL', 'READ', 'WRITE', 'NONE')),
        updated_by_id uuid references "user"(id) not null,
        constraint uq_role_menu_role_menu unique (role_id, menu_id)
      );`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_role_menu_lookup ON "role_menu" (role_id, menu_id);`,
    );
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_role_menu_lookup`);
    await queryRunner.query(`DROP TABLE IF EXISTS "role_menu"`);
  }
};
