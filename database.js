var pg = require('pg');
var conString = process.env.DATABASE_URL || "pg://postgres:1234@localhost:5432/users";
var client = new pg.Client(conString);
client.connect();

client.query("CREATE TABLE IF NOT EXISTS links(id serial, url varchar(255), title varchar(255),created  date not null default CURRENT_DATE , votes int, image varchar(255))");


exports.client = client;