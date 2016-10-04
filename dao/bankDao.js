// 实现与MySQL交互
var $sql = require('./bankSqlMapping');
var $dbc = require('./dbCommon');
var fs = require('fs');
var uuid = require('node-uuid');            //生成唯一码的模块

function add0(m) {
    return m < 10 ? '0' + m : m
}
function format(shijianchuo) {
//shijianchuo是整数，否则要parseInt转换
    shijianchuo = parseInt(shijianchuo)
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return '' + y + add0(m) + add0(d) + add0(h) + add0(mm) + add0(s);
}
module.exports = {
    productBankKey: function (req, res, next) {        //添加
        $dbc.pool.getConnection(function(err, connection) {
            var addTime = new Date().getTime();
            var fileTime = format(new Date().getTime());
            var param = req.query;       // 获取url上面的参数
            var fromUser = param.from;      //创建人，默认Tiny
            var toUser = param.to;      //购买人，即生成给谁用的
            var count = param.count;      //数量
            if(param.from == '' || param.from == undefined || param.to == '' || param.to == undefined || param.count == '' || param.count == undefined) {      //参数错误
                res.render('fail', {title: '生成失败', msg: '参数错误',  backUrl:''});      //参数错误，返回数据异常页面
                connection.release();   // 释放连接
            }else if(fromUser!='Tiny') {
                res.render('fail', {title: '生成失败', msg: '不知道你是谁',  backUrl:''});      //参数错误，返回数据异常页面
                connection.release();   // 释放连接
            }else if(isNaN(parseInt(count))) {      //如果传入的count参数不是数字
                res.render('fail', {title: '生成失败', msg: 'count参数错误',  backUrl:''});      //参数错误，返回数据异常页面
                connection.release();   // 释放连接
            } else {
                var bankKey = {};
                for(var i=1; i<=count; i++){
                    bankKey[i] = uuid.v4();
                }
                fs.writeFile('./'+fileTime+'bankKey.doc', JSON.stringify(bankKey), function (err){
                    fs.readFile('./'+fileTime+'bankKey.doc',function(err, data){
                        if(err){            //读取文件失败
                            ('file not found');         //文件不存在
                            res.render('fail', {title: '找不到文件', msg: 'file not found',  backUrl:''});      //参数错误，返回数据异常页面
                            connection.release();   // 释放连接
                        } else{
                            data = JSON.parse(data);
                            var insertSql = 'INSERT IGNORE INTO bankKey(bankKey,addTime,isUse,isSale,owner,buyer) VALUES ';
                            for(var d in data){
                                insertSql += '("' + data[d] + '",now(),0,1,"' + fromUser +'","' + toUser +'"),';
                            }
                            insertSql = insertSql.substring(0,insertSql.length-1);
                            var sqlData = [];
                            connection.query(insertSql, sqlData, function(err, result) {         //异步的执行
                                if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
                                    res.send(500);
                                    console.log(err);
                                }else{
                                    if(result.affectedRows == 0){       //affectdRows影响行数
                                        res.render('fail', {title: '生成失败', msg: '数据库插入失败',  backUrl:''});      //参数错误，返回数据异常页面
                                    }else if(result.affectedRows > 0){
                                        res.render('suc', {title: '生成成功', msg: '成功生成'+result.affectedRows+'条记录！',  backUrl:''});  
                                    }else{
                                        res.render('fail', {title: '生成失败', msg: '未知错误',  backUrl:''});  
                                    }
                                }        
                                connection.release();   // 释放连接
                            });
                        }
                    });
                })
            }
        });
    }

    
};
