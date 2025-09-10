const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
 host: "vsa-db-dev.cb462qmg6ec1.us-east-1.rds.amazonaws.com",
  port: 3306,
  user: "miniapp1",
  password: "miniapp@20251",
  database: "flo",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

let pool;

const getConnection = async () => {
  if (!pool) {
    try {
      pool = mysql.createPool(dbConfig);
      console.log('MySQL connection pool created successfully');
    } catch (error) {
      console.error('Error creating MySQL connection pool:', error);
      throw error;
    }
  }
  return pool;
};

const executeQuery = async (query, params = []) => {
  try {
    const connection = await getConnection();
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

module.exports = {
  getConnection,
  executeQuery
};