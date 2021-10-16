const fs = require('fs')

var pwd=fs.readFileSync('./.pwd', 'utf8');

var mysql = require("mysql2");
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'alumne',
	password : pwd,
	database: "la_palma"
});
connection.connect();
module.exports = connection;
