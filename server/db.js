const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root@123",
  database: "new_system_db",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;