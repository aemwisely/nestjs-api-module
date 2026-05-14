/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AlterTableRole1778138024575 {
  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE role ADD COLUMN prefix varchar(100) not null, ADD COLUMN type varchar(100) not null`,
    );

    await queryRunner.query(`ALTER TABLE menu ADD COLUMN type varchar(100) not null`);
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE role DROP COLUMN prefix, DROP COLUMN type`);

    await queryRunner.query(`ALTER TABLE menu DROP COLUMN type`);
  }
};
