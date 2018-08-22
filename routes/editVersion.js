var express = require('express');
var router = express.Router();
var db = require("../db/mysql");
var BaseResult = require('./BaseResult');

router.get('/', function(req, res, next) {
	db.queryVersionList(function(err, rows) {
  	if (err) {
  		res.send(500);
  		console.log(err);
  	}else {
  		console.log(rows.length+"---------length");
  		//BaseResult.SUCCESS.setData(rows[0]);
  		//res.send(BaseResult.SUCCESS);
  		res.render('upVersion', { versions: rows });
  	}
   });
  	
});
router.get('/add', function(req, res, next) {
  	res.render('addVersion', { title: '版本管理系统' });
});
module.exports = router;
