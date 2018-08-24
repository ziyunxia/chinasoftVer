var mysql = require("mysql");

var pool = mysql.createPool({
  host: "127.0.1",
  user: "root",
  password: "Rouch123456$",
  database: "upapk",
  port: "3306"
});

var query = function(sql, sqlParam, callback) {
  pool.getConnection(function(err, conn) {
    if (err) {
      callback(err, null, null);
    } else {
      conn.query(sql, sqlParam, function(err, rows, fields) {
        //释放连接
        conn.release();
        //事件驱动回调
        callback(err, rows, fields);
      });
    }
  });
};

//登录
exports.queryUser = function queryUser(username, pwd, callback) {
  
  let sql =
    "SELECT username,`password` FROM `user_info` WHERE username=? and `password`=?";
    
  console.log(username+' '+pwd+'  '+sql);
  query(sql, [username, pwd], function(err, rows) {
    if (err) {
      return console.error(err);
    }
    callback(err, rows);
  });
};

//查询最新版本
exports.queryVersion = function queryVersion(clienttype, callback) {
  
  let sql =
    "SELECT clientType,highstVer,lowestVer,compatiableVer,URL,MD5,describle FROM versions WHERE versions.clientType = ? ORDER BY versions.v_id DESC LIMIT 1";
    
  console.log(clienttype+'  '+sql);
  query(sql, [clienttype], function(err, rows) {
    if (err) {
      return console.error(err);
    }
    callback(err, rows);
  });
};

//查询版本列表
exports.queryVersionList = function queryVersionList(callback) {
  
  let sql =
    "SELECT v_id,clientType,highstVer,lowestVer,compatiableVer,URL,MD5,describle FROM versions ORDER BY versions.v_id DESC";
    
  console.log(' 版本列表sql '+sql);
  query(sql, function(err, rows) {
    if (err) {
      return console.error(err);
    }
    callback(err, rows);
  });
};

//新增一个版本
exports.addVersion = function addVersion(clientType,highstVer,lowestVer,compatiableVer,URL,MD5,describle,callback) {
  
  let sql =
    "INSERT INTO versions (clientType,highstVer,lowestVer,compatiableVer,URL,MD5,describle) VALUES (?,?,?,?,?,?,?);";
    
  console.log(' 新增版本sql '+sql);
  query(sql,[clientType,highstVer,lowestVer,compatiableVer,URL,MD5,describle], function(err, rows) {
    if (err) {
      return console.error(err);
    }
    callback(err, rows);
  });
};

//新增用户安装信息
exports.addInstallInfo = function addInstallInfo(deviceId,phoneType,callback) {
  
  let sql =
    "INSERT INTO install_info (deviceId,phoneType) VALUES (?,?);";
    
  console.log(' 新增用户安装信息sql '+sql);
  query(sql,[deviceId,phoneType], function(err, rows) {
    if (err) {
      return console.error(err);
    }
    callback(err, rows);
  });
};