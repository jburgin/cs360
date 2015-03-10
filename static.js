var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "html/";

http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true, false);
	if (urlObj.pathname.indexOf("getcity") != -1) {
		fs.readFile('cities.dat.txt', function (err, data) {
			if (err) throw err;
			var cities = data.toString().split("\n");
			var myRe = new RegExp("^" + urlObj.query["q"],"i"); // the i makes it case insensitive
			var jsonresult = []; // return empty if 
			if (urlObj.query["q"] != "") {
				for (var i = 0; i < cities.length; i++) {
					var result = cities[i].search(myRe);
					if (result != -1) {
						jsonresult.push({city:cities[i]});
					}
				}
			} 
			res.writeHead(200);
			res.end(JSON.stringify(jsonresult));
		});
	} else if (urlObj.pathname === "/comment") {
		if (req.method === "POST") {
			var jsonData = "";
			req.on('data', function (chunk) {
				jsonData += chunk;
			});
			req.on('end', function () {
				// Now put it into the database
				var MongoClient = require('mongodb').MongoClient;
				MongoClient.connect("mongodb://localhost/weather", function(err, db) {
					if(err) throw err;
					db.collection('comments').insert(reqObj,function(err, records) {
						console.log("Record added as "+records[0]._id);
					});
				});
			});
			res.writeHead(200);
			res.end();
		}
	} else {
		fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
			if (err) {
			  res.writeHead(404);
			  res.end(JSON.stringify(err));
			  return;
			}
			res.writeHead(200);
			res.end(data);
		});
	}
}).listen(80);