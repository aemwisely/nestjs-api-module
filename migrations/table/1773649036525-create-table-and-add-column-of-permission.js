/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateTableAndAddColumnOfPermission1773649036525 {
  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN session_id uuid null`);

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "role" (
        id uuid PRIMARY KEY UNIQUE,
        created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
        deleted_at timestamptz NULL,
        title varchar(255) NOT NULL,
        is_active boolean DEFAULT false NOT NULL,
        created_by_id uuid references "user"(id) null,
        updated_by_id uuid references "user"(id) null
      );`,
    );
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN session_id`);

    await queryRunner.query(`DROP TABLE IF EXISTS "role"`);
  }
};
