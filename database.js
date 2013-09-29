
var mysql = require("mysql")


// CHECK APPFOG MYSQL DATA
if(process.env.VCAP_SERVICES){
	var env = JSON.parse(process.env.VCAP_SERVICES);
	var creds = env['mysql-5.1'][0]['credentials'];
	var host = creds.hostname; 
	var user =  creds.username; 
	var password =  creds.password;
	var database = creds.name ;
	var portDB =  creds.port;
}else{
	var host = "localhost"; 
	var user =  "root"; 
	var password =  "";
	var database = "savelinks" ;
	var portDB =  3306;
}



var client = mysql.createConnection({
	host: host,
	user:  user,
	password: password,
	database: database,
	port: portDB
});


/*client.query(
	' CREATE DATABASE IF NOT exists savelinks',function(err, results, fields){
		if(err){
			client.end();
			throw err;
		}		
	}
);*/

//client.query('USE savelinks')
client.query(
	'CREATE TABLE IF NOT EXISTS links  ' +
	'(id INT(11) AUTO_INCREMENT, ' +
	' url VARCHAR(255), ' +
	' created TIMESTAMP DEFAULT CURRENT_TIMESTAMP(), ' +
	' PRIMARY KEY(id)) CHARSET=utf8'

);

exports.client = client;