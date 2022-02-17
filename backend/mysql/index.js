const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'i5a203.p.ssafy.io',
    user: 'user',
    password: process.env.dbPassword,
    database: 'refreci',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3306,
});

module.exports = { pool };
