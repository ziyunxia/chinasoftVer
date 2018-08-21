var express = require('express');
var router = express.Router();
var fs = require('fs');
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
// 微信小程序 图片上传
var multer  = require('multer');
var upload = multer({ dest: './tmp/' });
// 图片上传
router.post('/', upload.single('file'), function(req, res, next) {
    // 文件路径
    var filePath = './' + req.file.path;  
    console.log("------filepath----"+filePath);
    // 文件类型
    var temp = req.file.originalname.split('.');
    var fileType = temp[temp.length - 1];
    var lastName = '.' + fileType;
    // 构建图片名
    var fileName = Date.now() + lastName;
    // 图片重命名
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
              var imageSrc = 'http://oss-jyxb-file.oss-cn-beijing.aliyuncs.com/' + result.name;
              console.log("---imageSrc----"+imageSrc)
              // 上传之后删除本地文件
              fs.unlinkSync(localFile);
              res.end(JSON.stringify({status:'100',msg:'上传成功',imageUrl:imageSrc})); 
            }).catch(function (err) {
              // 上传之后删除本地文件
              fs.unlinkSync(localFile);
              res.end(JSON.stringify({status:'101',msg:'上传失败',error:JSON.stringify(err)})); 
            });
        }
    });
})
module.exports = router;