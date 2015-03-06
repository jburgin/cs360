var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "html/";

http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true, false);
	if (urlObj.pathname.indexOf("getcity") != -1) {
		console.log("URL query " + urlObj.query["q"]);
		fs.readFile('cities.dat.txt', function (err, data) {
			if (err) throw err;
			var cities = data.toString().split("\n");
			var myRe = new RegExp("^" + urlObj.query["q"]);
				console.log(cities);
			var jsonresult = [];
			for (var i = 0; i < cities.length; i++) {
				var result = cities[i].search(myRe);
				if (result != -1) {
					jsonresult.push({city:cities[i]});
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