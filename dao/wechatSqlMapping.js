// dao/userSqlMapping.js
// CRUD SQL语句
var wechat = {
    addWxOpenId:'INSERT IGNORE INTO user(wxOpenId,addTime,editTime) VALUES(?,?,?)',
    addWxUser: 'INSERT IGNORE INTO user (wxOpenId,addTime,editTime,nickname,sex,province,city,country,headimgurl,subscribe_time,subscribe,tryTime) values (?,?,?,?,?,?,?,?,?,FROM_UNIXTIME(?),?,?);',      //关注的时候新增用户数据，数据库中建立了name和userId的唯一索引，这里如果name和userId已存在的话将不会插入，影响行数为0，否则插入影响行数为1（insert ignore）
    updateWxUser: 'UPDATE user set editTime=?,nickname=?,sex=?,province=?,city=?,country=?,headimgurl=?,subscribe=?,subscribe_time=FROM_UNIXTIME(?) where wxOpenId=?',      //更新用户数据
    unsubscribe: 'UPDATE user set subscribe=? where wxOpenId=?',      //取消关注
    edit:'update ignore agent set name=?, productName=?, levelName=?, price=?, editTime=?, remark=? where id=? and userId=?',
    queryByOpenId: 'select id,subscribe,nickname from user where wxOpenId=?',        //根据微信openid查询，查询数据库中是否存在当前openid
    checkBankByOpenId: 'select id,subscribe,nickname,isBank,tryTime from user where wxOpenId=?',        //根据微信openid查询，查询数据库中是否存在当前openid并isBank为1
    checkBankKey: 'update bankKey set isUse=1,useTime=?,wxOpenId=? where bankKey=? and owner="Tiny" and isSale=1 and isUse=0 limit 1',        //验证银行账单生成激活码
    activeBank: 'update user set isBank=1,bankKey=?,editTime=? where wxOpenId=?',        //根据微信openid查询，查询数据库中是否存在当前openid并isBank为1
    queryAll: 'select id,name,levelName,productName,userId,price,remark from agent where userId=?',
    delete: 'delete from agent where id=? and userId=?',
    getOpenId: 'select wxOpenId from user where 1=1'
};

module.exports = wechat;