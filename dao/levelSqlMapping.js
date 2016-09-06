// dao/userSqlMapping.js
// CRUD SQL语句
var level = {
    add:'INSERT INTO level(name,productId,productName,userId,userName,price,addTime,editTime) VALUES(?,?,?,?,?,?,?,?)',
    queryProductByUId: 'select id,name from product where userId=?',
    queryByName:'select * from level where name=? and userId=?',
    queryAll: 'select * from level where userId=?',
    queryById: 'select * from level where id=?',
    edit:'update level set name=?, remark=?, editTime=? where id=?',
    delete: 'delete from level where id=?',
};

module.exports = level;