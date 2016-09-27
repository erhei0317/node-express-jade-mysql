// dao/userSqlMapping.js
// CRUD SQL语句
var wechat = {
    addWxOpenId:'INSERT IGNORE INTO user(wxOpenId,addTime,editTime) VALUES(?,?,?)',
    insertWxUser: 'INSERT IGNORE INTO user (nickname,sex,province,city,country,headimgurl,privilege,unionid) values (?,?,?,?,?,?,?,?);',      //数据库中建立了name和userId的唯一索引，这里如果name和userId已存在的话将不会插入，影响行数为0，否则插入影响行数为1（insert ignore）
    updateWxUser: 'UPDATE IGNORE user set nickname=?,sex=?,province=?,city=?,country=?,headimgurl=?,unionid=?,editTime=? where wxOpenId=?',      //数据库中建立了name和userId的唯一索引，这里如果name和userId已存在的话将不会插入，影响行数为0，否则插入影响行数为1（insert ignore）
    addLevel: 'INSERT IGNORE INTO level (name,userId,userName,addTime) values (?,?,?,?);',
    queryLevelByUId: 'select name from level where userId=?',
    queryProductByUId: 'select name from product where userId=?',
    edit:'update ignore agent set name=?, productName=?, levelName=?, price=?, editTime=?, remark=? where id=? and userId=?',
    queryByName:'select userId from agent where name=? and userId=? and productName=?',
    queryByOpenId: 'select nickname from user where wxOpenId=?',        //根据微信openid查询，如果不存在，则表示还没关注
    queryAll: 'select id,name,levelName,productName,userId,price,remark from agent where userId=?',
    delete: 'delete from agent where id=? and userId=?'
};

module.exports = wechat;