/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

const { TableIndex } = require('typeorm');

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateTableActionLog1778240000000 {
  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "action_log" (
        id uuid PRIMARY KEY UNIQUE,
        created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
        deleted_at timestamptz NULL,
        account_id uuid NULL,
        account_email varchar NULL,
        action text NOT NULL,
        method varchar NOT NULL,
        path text NOT NULL,
        ip_address varchar NULL,
        browser text NULL,
        status_code int NULL,
        request_body jsonb NULL,
        request_params jsonb NULL,
        request_query jsonb NULL
      );`,
    );

    await queryRunner.createIndex(
      'action_log',
      new TableIndex({
        columnNames: ['account_id'],
      }),
    );

    await queryRunner.createIndex(
      'action_log',
      new TableIndex({
        columnNames: ['method'],
      }),
    );

    await queryRunner.createIndex(
      'action_log',
      new TableIndex({
        columnNames: ['path'],
      }),
    );

    await queryRunner.createIndex(
      'action_log',
      new TableIndex({
        columnNames: ['created_at'],
      }),
    );
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE IF EXISTS "action_log"`);
  }
};
