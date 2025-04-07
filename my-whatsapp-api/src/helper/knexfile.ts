require('dotenv').config();
require('dotenv').config({path:"../.env"});
const path = require('path');

console.log(process.env.POSTGRES_USER)
console.log(process.env.POSTGRES_DB)

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME, 
      port: process.env.DB_PORT
    },
    migrations: {
      directory: './migrations', 
    },
  },
};