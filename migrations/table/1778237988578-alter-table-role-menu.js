/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AlterTableRoleMenu1778237988578 {
  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    // change to nullable
    await queryRunner.query(`ALTER TABLE role_menu ALTER COLUMN updated_by_id DROP NOT NULL`);
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE role_menu ALTER COLUMN updated_by_id SET NOT NULL`);
  }
};
