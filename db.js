const mysql = require("mysql2");
const config = require("./config");

const connection = mysql.createConnection(config.db);

module.exports = connection.promise();
