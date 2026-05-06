/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

const { TableIndex } = require('typeorm');

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateTableToken1778048829597 {
  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "token" (
        id uuid PRIMARY KEY UNIQUE,
        created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
        deleted_at timestamptz NULL,
        user_id uuid not null,
        access_token text not null,
        refresh_token text not null,
        session_id uuid not null,
        is_revoked boolean default false not null,
        expires_at timestamptz null,
        refresh_expires_at timestamptz null
      );`,
    );

    await queryRunner.createIndex(
      'token',
      new TableIndex({
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'token',
      new TableIndex({
        columnNames: ['session_id'],
      }),
    );

    await queryRunner.createIndex(
      'token',
      new TableIndex({
        columnNames: ['access_token'],
      }),
    );

    await queryRunner.createIndex(
      'token',
      new TableIndex({
        columnNames: ['refresh_token'],
      }),
    );

    await queryRunner.createIndex(
      'token',
      new TableIndex({
        columnNames: ['is_revoked'],
      }),
    );

    await queryRunner.createIndex(
      'token',
      new TableIndex({
        columnNames: ['expires_at'],
      }),
    );
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE IF EXISTS "token"`);
  }
};
