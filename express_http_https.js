var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();
app.use(bodyParser());
var options = {
    host: '127.0.0.1',
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
};
  
  var basicAuth = require('basic-auth-connect');
  var auth = basicAuth(function(user, pass) {
    return((user ==='cs360')&&(pass === 'test'));
  });

  http.createServer(app).listen(80);
  https.createServer(options, app).listen(443);
  app.use('/', express.static('./html', {maxAge: 60*60*1000}));
  app.get('/getcity', function (req, res) {
    fs.readFile('cities.dat.txt', function (err, data) {
			if (err) throw err;
			var cities = data.toString().split("\n");
			var myRe = new RegExp("^" + req.param("q"),"i"); // the i makes it case insensitive
			var jsonresult = []; // return empty if 
			if (req.param("q") != "") {
				for (var i = 0; i < cities.length; i++) {
					var result = cities[i].search(myRe);
					if (result != -1) {
						jsonresult.push({city:cities[i]});
					}
				}
			} 
			res.status(200);
			res.json(jsonresult);
		});
  });
  app.get('/comment', function (req, res) {
	// Read all of the database entries and return them in a JSON array
	  var MongoClient = require('mongodb').MongoClient;
	  MongoClient.connect("mongodb://localhost/weather", function(err, db) {
		if(err) throw err;
		db.collection("comments", function(err, comments){
		  if(err) throw err;
		  comments.find(function(err, items){
			items.toArray(function(err, itemArr){
			  res.status(200);
			  res.json(itemArr);
			});
		  });
		});
	  });
  });
  app.post('/comment', auth, function (req, res) {
		var comment = JSON.parse(req.body);
		console.log(comment);
		// Now put it into the database
		var MongoClient = require('mongodb').MongoClient;
		MongoClient.connect("mongodb://localhost/weather", function(err, db) {
			if(err) throw err;
			db.collection('comments').insert(comment,function(err, records) {
				console.log("Record added as "+records[0]._id);
			});
		});

	res.status(200);
	res.end();
  });