/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateTableMediaObject1774610940831 {
  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "media_object" (
        id uuid PRIMARY KEY UNIQUE,
        created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
        deleted_at timestamptz NULL,
        name text null,
        mimetype varchar(255) null,
        url text null,
        bucket varchar(255) null,
        expire_date timestamptz null,
        is_public boolean default false not null
      );`,
    );
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE IF EXISTS "media_object"`);
  }
};
