const knex = require('knex');
require('dotenv').config({ path: "../.env" });
const knexConfig = require("./knexfile")

const db = knex(knexConfig.development)


interface ErrorType{
    err:string
}


// Test the connection
db.raw('SELECT 1')
  .then(() => {
    console.log('Connected PostgreSQL successfully!');
  })
  .catch((err:ErrorType) => {
    console.error('Error connecting to PostgreSQL:', err);
  });

// /**
//  * Wrapper function around the db instance.
//  * @param {string} tableName - Name of the table.
//  * @returns {Promise} - Returns the promise from knex.
//  */
export const queryTable = (tableName:string,data:any) => {
  return db(tableName).insert(data).returning("*");
};

export const fetchDataById= (tableName:string,id:string)=>{
  return db(tableName).where({id}).first()
}

export const selectFromTable = (tableName:string, columns = '*', whereClause = {}) => {
  return db(tableName).select(columns).where(whereClause);
};


export const updateTable = (tableName: string, updateData: any, whereClause: any) => {
  return db(tableName).where(whereClause).update(updateData);
};



export default db;