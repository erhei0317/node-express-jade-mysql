// dao/userDao.js
// 实现与MySQL交互
var $sql = require('./loginSqlMapping');
var $dbc = require('./dbCommon');

module.exports = {
    submit: function (req, res, next) {
        $dbc.pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body;
            // 建立连接，向表中查询用户是否存在，验证密码和账户是否相等
            connection.query($sql.submit, [param.name, param.password], function(err, result) {
                if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
                    res.send(500);
                    console.log(err);
                }else if(result.length>0&&result[0].name==param.name&&result[0].password==param.password) {    //账号密码验证通过
                    req.session.uid = result[0].id;
                    req.session.name = result[0].name;
                    res.redirect("/index");
                }else{      //账号密码验证失败
                    req.session.id = null;
                    req.session.name = null;
                    req.session.error = '账号或者密码错误';
                    res.redirect("/fail");
                }
                // 以json形式，把操作结果返回给前台页面
                //$dbc.jsonWrite(res, result);
                // 释放连接 
                connection.release();
            });
        });
    },
    queryAll: function (req, res, next) {
        $dbc.pool.getConnection(function(err, connection) {
            var param = req.body;
            connection.query($sql.queryById,param.username, function(err, result) {
                $dbc.jsonWrite(res, result);
                connection.release();
            });
        });
    }
    
};
