const { DataSource } = require('typeorm');
const path = require('path');
require('dotenv').config();

function env(key) {
  return process.env[key];
}

const baseConfig = new DataSource({
  type: 'postgres',
  host: env('DB_HOST'),
  port: env('DB_PORT'),
  username: env('DB_USERNAME'),
  password: env('DB_PASSWORD'),
  database: env('DB_DATABASE'),
  migrations: [path.resolve('.', 'migrations', 'table', '*{.js,.ts}')],
  cli: {
    migrationsDir: path.resolve('.', 'migrations', 'table'),
  },
});

module.exports = { baseConfig };
