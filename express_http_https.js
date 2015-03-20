var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();
var options = {
    host: '127.0.0.1',
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
};
  http.createServer(app).listen(80);
  https.createServer(options, app).listen(443);
  app.use('/', express.static('./html', {maxAge: 60*60*1000}));
  app.get('/getcity', function (req, res) {
    fs.readFile('cities.dat.txt', function (err, data) {
			if (err) throw err;
			console.log("param:" + req.param("q"));
			var cities = data.toString().split("\n");
			var jsonresult = []; // return empty if 
			if (req.param("q") != "") {
				for (var i = 0; i < cities.length; i++) {
					var result = cities[i].search(req.param("q"));
					if (result != -1) {
						jsonresult.push({city:cities[i]});
					}
				}
			} 
			res.json(jsonresult);
		});
  });