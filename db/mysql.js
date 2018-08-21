var mysql = require("mysql");

var pool = mysql.createPool({
  host: "192.168.60.217",
  user: "shixq",
  password: "shixq123",
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

exports.queryVersionList = function queryVersionList(callback) {
  
  let sql =
    "SELECT clientType,highstVer,lowestVer,compatiableVer,URL,MD5,describle FROM versions ORDER BY versions.v_id DESC";
    
  console.log(' 版本列表sql '+sql);
  query(sql, function(err, rows) {
    if (err) {
      return console.error(err);
    }
    callback(err, rows);
  });
};