/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddColumnInUser1773741566376 {
  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN refresh_token varchar(255) null, ADD COLUMN role_id uuid references role(id) null`,
    );
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN refresh_token, DROP COLUMN role_id`);
  }
};
