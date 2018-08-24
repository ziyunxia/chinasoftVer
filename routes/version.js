var express = require('express');
var router = express.Router();
var db = require("../db/mysql");
var BaseResult = require('./BaseResult');
router.get("/",function(req,res){ 					   
	 var clientType = req.query.clientType;
	 var deviceId = req.query.deviceId;
	 var phoneType = req.headers['user-agent'];
	 console.log('clientType='+clientType);
	 console.log('User-Agent'+ phoneType);
	 
   db.queryVersion(clientType,function(err, rows) {
  	if (err) {
  		res.send(500);
  		console.log(err);
  	}else {
  		console.log(rows.length+"---------length");
  		BaseResult.SUCCESS.setData(rows[0]);
  		res.send(BaseResult.SUCCESS);
  	}
   });
   
   db.addInstallInfo(deviceId,phoneType,function(err, rows) {
  	
   });

   
});

module.exports = router;
