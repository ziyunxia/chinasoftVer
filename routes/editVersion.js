var express = require('express');
var router = express.Router();
var db = require("../db/mysql");
var BaseResult = require('./BaseResult');
var md5=require('md5-node');
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
  	res.render('addVersion', { title: '新增版本' });
}).post('/add', function(req, res, next) {
  	var version = req.body;
	var highstVer = version.highstVer;
	var clientType = version.clientType;
	var lowestVer = version.lowestVer;
	var compatiableVer = version.compatiableVer;
	var describle = version.describle;
	var fileSrc = version.URL;
    console.log("---fileSrc----"+fileSrc);
    var jiami = md5(highstVer+""+fileSrc+""+clientType);
  
  db.addVersion(clientType,highstVer,lowestVer,compatiableVer,fileSrc,jiami,describle,function(err, rows) {
			  	if (err) {
			  		res.send(500);
			  		console.log(err);
			  	}else {
			  		res.redirect("/versions");
	  	}
	  });
});
module.exports = router;
