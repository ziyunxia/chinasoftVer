var express = require('express');
var router = express.Router();
var db = require("../db/mysql");
var BaseResult = require('./BaseResult');
router.post("/",function(req,res){ 					   // 从此路径检测到post方式则进行post数据的处理操作
	 var _user = req.body;
	 var username = _user.username;
	 var password = _user.password;
	 
	 console.log('username='+username);
	 console.log('password='+password);
   db.queryUser(username, password,function(err, rows) {
  	if (err) {
  		res.send(500);
  		console.log(err);
  	}else {
  		
  		if(rows.length==0){
  			 res.send(BaseResult.USER_PASSWORD_ERROR);
  			 
  		}else{
  			console.log(rows[0].username+"--结果集--"+rows[0].password);
  			
  			 res.send(BaseResult.SUCCESS);
  		}

  	}
  });
});
module.exports = router;
