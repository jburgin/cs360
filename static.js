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
			} else if (urlObj.pathname.indexOf("comment") != -1) {
				console.log("comment route");
				if (req.method === "POST") {
					console.log("POST comment route");
				}
			}
			res.writeHead(200);
			res.end(JSON.stringify(jsonresult));
		});
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