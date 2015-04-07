var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("ID" + process.pid);
  res.render('index', { title: 'Express', pid:process.pid });
});

module.exports = router;
