const mysql = require ("mysql2");
require ("dotenv").config()

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: process.env.DB_USER,
      // MySQL password
      password: process.env.DB_PW,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the classlist_db database.`)
  );

  module.exports = db;