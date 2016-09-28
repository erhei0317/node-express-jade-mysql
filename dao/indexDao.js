// dao/userDao.js
// 实现与MySQL交互
var $sql = require('./indexSqlMapping');
var $dbc = require('./dbCommon');

module.exports = {
    //根据id查询
    getUserById: function (req, res, next) {
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid || '';
            var openid = req.session.openid || '';
            connection.query($sql.getUserById, [uId, openid], function(err, result) {
                if(err){                                         //错误就返回给原post处 状态码为500的错误
                    res.send(500);
                    console.log(err);
                }
                if(result == ''){       //查询不到
                    result = [{nickname: '游客', headimgurl: '/img/person-user.png'}];      //回填的信息，添加的时候都是空的
                }else{
                    result = result;
                }
                res.render('index', {title: 'Welcome', result: result});
                connection.release();
            });
        });
    },

};
