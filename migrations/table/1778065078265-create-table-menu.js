/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateTableMenu1778065078265 {
  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "menu" (
        id serial primary key,
        created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
        deleted_at timestamptz NULL,
        title varchar(255) not null,
        key varchar(255) unique not null,
        is_active boolean default false not null,
        code varchar(255) unique not null
      );`,
    );
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_menu_code_active ON "menu" (code, is_active);`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_menu_key_active ON "menu" (key, is_active);`);
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_menu_key_active`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_menu_code_active`);
    await queryRunner.query(`DROP TABLE IF EXISTS "menu"`);
  }
};
