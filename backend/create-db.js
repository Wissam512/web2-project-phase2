require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
  const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

  try {
    const connection = await mysql.createConnection({
      host: DB_HOST || '127.0.0.1',
      user: DB_USER || 'root',
      password: DB_PASS || '',
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME || 'my_project_db'}\`;`);
    console.log(`Database "${DB_NAME || 'my_project_db'}" checked/created successfully.`);
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  }
}

createDatabase();
