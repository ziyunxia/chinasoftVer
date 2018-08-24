var express = require('express');
var router = express.Router();
var db = require("../db/mysql");
var fs = require('fs');
var md5=require('md5-node');

//var md5=require("md5");

// 初始化Client
var co = require('co');
var OSS = require('ali-oss');
var client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAIa5xHoRzvSkgi',
  accessKeySecret: 'coxFCwaLmNhOnJmC1Y4lF6JpY4hmMH'
});

var ali_oss = {
    bucket: 'oss-jyxb-file',
    endPoint: 'oss-cn-beijing.aliyuncs.com',
}
// 文件上传
var multer  = require('multer');
var upload = multer({ dest: './tmp/' });
// 文件上传
router.post('/', upload.single('file'), function(req, res, next) {
	var version = req.body;
	var highstVer = version.highstVer;
	var clientType = version.clientType;
	var lowestVer = version.lowestVer;
	var compatiableVer = version.compatiableVer;
	var describle = version.describle;
	
	/*console.log(highstVer);
	console.log(clientType);
	console.log(lowestVer);
	console.log(compatiableVer);
	console.log(describle);*/
    // 文件路径
    var filePath = './' + req.file.path;  
    console.log("------filepath----"+filePath);
    // 文件类型
    var temp = req.file.originalname.split('.');
    var fileType = temp[temp.length - 1];
    var lastName = '.' + fileType;
    // 构建文件名
    var fileName = 'jyxb/file/'+Date.now() + lastName;
    // 文件重命名
    fs.rename(filePath, fileName, (err) => {
        if (err) {
            res.end(JSON.stringify({status:'102',msg:'文件写入失败'}));   
        }else{
            var localFile = './' + fileName;  
            var key = fileName;

            // 阿里云 上传文件 
            co(function* () {
              client.useBucket(ali_oss.bucket);
              var result = yield client.put(key, localFile);
              var fileSrc = 'https://oss-jyxb-file.oss-cn-beijing.aliyuncs.com/' + result.name;
              console.log("---fileSrc----"+fileSrc);
              var jiami = md5(highstVer+""+fileSrc+""+clientType);
              // 上传之后删除本地文件
              fs.unlinkSync(localFile);
              db.addVersion(clientType,highstVer,lowestVer,compatiableVer,fileSrc,jiami,describle,function(err, rows) {
						  	if (err) {
						  		res.send(500);
						  		console.log(err);
						  	}else {
						  		res.redirect("/versions");
						  	}
						  });
              //res.end(JSON.stringify({status:'100',msg:'上传成功',fileSrc:fileSrc})); 
            }).catch(function (err) {
              // 上传之后删除本地文件
              fs.unlinkSync(localFile);
              res.send(JSON.stringify({status:'101',msg:'上传失败',error:JSON.stringify(err)})); 
            });
        }
    });
})
module.exports = router;