var express = require('express');
var router = express.Router();
var db = require("../db/mysql");
var fs = require('fs');
var BaseResult = require('./BaseResult');

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
    // 文件路径
    var filePath = './' + req.file.path;  
    console.log("------filepath----"+filePath);
    // 文件类型
    var temp = req.file.originalname.split('.');
    var fileType = temp[temp.length - 1];
    var lastName = '.' + fileType;
    console.log("------lastName----"+lastName);
    // 构建文件名
    var fileName = Date.now() + lastName;
    // 文件重命名
    fs.rename(filePath, fileName, (err) => {
        if (err) {
	        	BaseResult.FAILED.setData('文件写入失败');
	  				res.send(BaseResult.FAILED);
          //  res.end(JSON.stringify({status:'102',msg:'文件写入失败'}));   
        }else{
            var localFile = './' + fileName;  
            console.log("------localFile----"+localFile);
            var key = 'jyxb/file/'+fileName;
						console.log("------key----"+key);
            // 阿里云 上传文件 
            co(function* () {
              client.useBucket(ali_oss.bucket);
              var result = yield client.put(key, localFile);
              var fileSrc = 'https://oss-jyxb-file.oss-cn-beijing.aliyuncs.com/' + result.name;
              console.log("---fileSrc----"+fileSrc);
              BaseResult.SUCCESS.setData(fileSrc);
  						res.send(BaseResult.SUCCESS);
              // 上传之后删除本地文件
              fs.unlinkSync(localFile);
              
            }).catch(function (err) {
              // 上传之后删除本地文件
              fs.unlinkSync(localFile);
              BaseResult.FAILED.setData('上传失败');
	  				  res.send(BaseResult.FAILED);
            });
        }
    });
})
module.exports = router;