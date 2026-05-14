const { Client } = require('pg');
const bcrypt = require('bcrypt');
const { uuidv7 } = require('uuidv7');
require('dotenv').config();

function getEnv(key, fallback) {
  const value = process.env[key];

  if ((value === undefined || value === '') && fallback === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value || fallback;
}

function createPgClient() {
  return new Client({
    user: getEnv('DB_USERNAME'),
    host: getEnv('DB_HOST'),
    database: getEnv('DB_DATABASE'),
    password: getEnv('DB_PASSWORD'),
    port: Number(getEnv('DB_PORT', 5432)),
  });
}

async function getHashPassword(password) {
  const saltRound = Number(getEnv('SERVICE_SALTROUND', 10));

  if (Number.isNaN(saltRound)) {
    throw new Error('SERVICE_SALTROUND must be a number');
  }

  return bcrypt.hash(password, saltRound);
}

async function clearBaseData(client) {
  await client.query(`DELETE FROM role_menu`);

  await client.query(`
    DELETE FROM "user"
    WHERE role_id IN (
      SELECT id FROM role
      WHERE prefix IN ('SUPPORT', 'ADMINISTRATOR')
    )
  `);

  await client.query(`
    DELETE FROM role
    WHERE prefix IN ('SUPPORT', 'ADMINISTRATOR')
  `);

  await client.query(`
    DELETE FROM menu
    WHERE key IN ('user.management', 'role.management')
  `);
}

async function createMenuBase(client) {
  const menus = [
    {
      title: 'จัดการผู้ใช้งาน',
      key: 'user.management',
      is_active: true,
      code: '01',
      type: 'BACKOFFICE',
    },
    {
      title: 'บทบาทและสิทธิ์การเข้าถึง',
      key: 'role.management',
      is_active: true,
      code: '03',
      type: 'BACKOFFICE',
    },
  ];

  const query = `
    INSERT INTO menu (title, key, is_active, code, type)
    VALUES ($1, $2, $3, $4, $5)
  `;

  for (const menu of menus) {
    await client.query(query, [menu.title, menu.key, menu.is_active, menu.code, menu.type]);
  }
}

async function createRoleBase(client) {
  const roles = [
    {
      id: uuidv7(),
      title: 'Supporter',
      is_active: true,
      prefix: 'SUPPORT',
      type: 'ALL',
    },
    {
      id: uuidv7(),
      title: 'Administrator',
      is_active: true,
      prefix: 'ADMINISTRATOR',
      type: 'BACKOFFICE',
    },
  ];

  const query = `
    INSERT INTO role (id, title, is_active, prefix, type)
    VALUES ($1, $2, $3, $4, $5)
  `;

  for (const role of roles) {
    await client.query(query, [role.id, role.title, role.is_active, role.prefix, role.type]);
  }
}

async function createRoleMenuBackoffice(client) {
  const { rows: roles } = await client.query(`
    SELECT id
    FROM role
    WHERE prefix IN ('SUPPORT', 'ADMINISTRATOR')
  `);

  const { rows: menus } = await client.query(`
    SELECT id
    FROM menu
    WHERE type = 'BACKOFFICE'
  `);

  const query = `
    INSERT INTO role_menu (role_id, menu_id, permission)
    VALUES ($1, $2, $3)
  `;

  for (const role of roles) {
    for (const menu of menus) {
      await client.query(query, [role.id, menu.id, 'ALL']);
    }
  }
}

async function createMemberBase(client) {
  const { rows: roles } = await client.query(`
    SELECT id, prefix
    FROM role
    WHERE prefix IN ('SUPPORT', 'ADMINISTRATOR')
  `);

  const roleMap = roles.reduce((acc, role) => {
    acc[role.prefix] = role.id;
    return acc;
  }, {});

  if (!roleMap.ADMINISTRATOR || !roleMap.SUPPORT) {
    throw new Error('Missing base roles: ADMINISTRATOR or SUPPORT');
  }

  const adminPassword = await getHashPassword('p@SSw0rd');
  const supportPassword = await getHashPassword('p@$$w0rd!');

  const members = [
    {
      id: uuidv7(),
      first_name: 'John',
      last_name: 'Doe',
      is_active: true,
      email: 'adm1n@email.com',
      password: adminPassword,
      role_id: roleMap.ADMINISTRATOR,
    },
    {
      id: uuidv7(),
      first_name: 'Baby',
      last_name: 'Doe',
      is_active: true,
      email: 'support@email.com',
      password: supportPassword,
      role_id: roleMap.SUPPORT,
    },
  ];

  const query = `
    INSERT INTO "user" (
      id,
      first_name,
      last_name,
      is_active,
      email,
      password,
      role_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;

  for (const member of members) {
    await client.query(query, [
      member.id,
      member.first_name,
      member.last_name,
      member.is_active,
      member.email,
      member.password,
      member.role_id,
    ]);
  }
}

async function main() {
  const client = createPgClient();

  try {
    await client.connect();
    await client.query('BEGIN');

    await clearBaseData(client);
    await createMenuBase(client);
    await createRoleBase(client);
    await createRoleMenuBackoffice(client);
    await createMemberBase(client);

    await client.query('COMMIT');
    console.log('Seed completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
