var express = require("express");
var path = require("path");
var app = module.exports = express();
var request = require('request');
var db = require("./database");
var helpers = require("./helpers");


app.use(express.logger());

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public/images/avatar/" }));
	app.use(express.methodOverride());
	app.use(app.router);	
	app.use(express.static(path.join(__dirname, 'public')));
});



app.get('/', function(req, res) {
  res.render('index');
});

// GET ALL LINKS
app.get('/links', function(req, res) {
	params = req.query.type;

	function getLinks(query){
		var q = db.client.query(query);
		rows = [];
		q.on("row", function (row, result) {
	    	rows.push(row);
		});
		q.on("end", function(result){
			res.json(rows);
		});
	}

	if(!params){
		getLinks("SELECT * FROM links ORDER BY id DESC");	
	}else{
		getLinks("SELECT * FROM links ORDER BY votes DESC");
	}
	
	
});


// INSERT A LINK
app.post("/links", function(req, res){
	var url = req.body.url;
	var created = new Date();
	
	request(url, function(error, response, body) {
		var page = helpers.getImageTitlePage(body); 
		var img = page.img;
		var title = page.title;
		if(error){
			img = "http://2.bp.blogspot.com/-a8vbngYIJM4/TxOA6L0U7ZI/AAAAAAAAACo/vuGp_iFIOKM/s320/internet8.jpg";
		}
		var data = [url, 0, img,  created, title];
		var q = db.client.query("INSERT INTO links(url, votes, image, created, title) values ($1, $2, $3, $4, $5) RETURNING id", data);
		q.on("row", function(lastId){
			lastRow = {
				id: lastId.id,
				title: title,
				image: img,
				votes: 0,
				url: url,
				created: new Date()
			}
			res.json(lastRow);
		});
	});
});

// DELETE A LINK
app.delete("/links/:id", function(req, res){
	idLink = req.params.id;
	var del = db.client.query("DELETE FROM links WHERE id = ($1)", [idLink]);
	del.on('end', function(result){
		if(result.rowCount){
			res.json(result);
		}
	});

});

// VOTE LINK
app.put("/links/:id", function(req, res){
	idLink = req.params.id;
	var vote = db.client.query("UPDATE links SET votes = votes + 1 WHERE id = ($1)", [idLink]);
	vote.on("end", function(result){
		res.json(result);
	});
});


app.get("/drop", function(req, res){
	var drop = db.client.query("DROP TABLE links");
	drop.on("end", function(result){
		res.json(result);
	});
});

var cheerio = require('cheerio');
app.get("/insert", function(req, res){
	var url = "http://www.ole.com.ar/futbol-internacional/inglaterra/Sueno-jugar-Boca_0_1004299871.html";
	request(url, function(error, response, body) {
		//ar img = getImagePage(body)
		//res.json(img)
		//var $ = cheerio.load(body);
		res.json(helpers.getImageTitlePage(body));
	});
	/*
	data = ["http://yahoo.com", 0, "http://3.bp.blogspot.com/_-nrolqmXOts/SwqXgP2uRkI/AAAAAAAAAOI/xO6er8uWpM4/s400/Rush-band_l.jpg"] 
	var q = client.query("INSERT INTO links(url, votes, image) values ($1, $2, $3) RETURNING id", data);
	
	q.on("row", function(result){
		//lastId = client.query("SELECT currval(pg_get_serial_sequence('links', 'id')");
		//res.json(lastId);
		
		res.json(result);
	});
	*/
});



var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

