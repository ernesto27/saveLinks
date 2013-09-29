var express  = require("express");
var path = require("path");
var port = 9000;

var app = module.exports = express();

console.log(process.env.VCAP_SERVICES)

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public/images/avatar/" }));
	app.use(express.methodOverride());
	app.use(app.router);	
	app.use(express.static(path.join(__dirname, 'public')));
});

//var moment = require('moment');
//console.log(moment("2013-09-29T03:37:39.000Z", "YYYYMMDD").fromNow())



var server  = require("http").createServer(app)

var db = require("./database")

app.get("/", function(req,res){
    res.render("index");
});

/*
 * GET ALL LINKS ON LOAD PAGE
 */
app.get("/links", function(req, res){
	links = db.client.query("SELECT * FROM links ORDER BY created DESC", function(err, result){
		if(!err){

			res.json(result)
		}
	});
});


/*
 * SAVE A LINK
 */
 
app.post("/links", function(req, res){
	url = req.body.url;
	setTimeout(function(){
		var i = db.client.query("INSERT INTO links (url) VALUES (?)", [url], function(err, result){
			if (!err){
				lastId = result.insertId;
				db.client.query("SELECT * FROM links WHERE id = (?)", [lastId], function(err, result){
					if(!err){
						res.json(result)
					}
				});
			}
		});
	},500);
	
});


// DELETE A LINK
app.delete("/links/:id", function(req, res){
	idLink = req.params.id;

	setTimeout(function(){
		var i = db.client.query("DELETE FROM links WHERE id = (?)", [idLink], function(err, result){
			if (!err){
				res.json({status: "ok delete"})
			}else{
				res.json("we have an error")
			}
		});
	},500);
});



app.listen(process.env.VCAP_APP_PORT || port, function(){
	console.log("server run in port " + port)
});


























