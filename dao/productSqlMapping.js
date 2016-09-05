// dao/userSqlMapping.js
// CRUD SQL语句
var product = {
    add:'INSERT INTO product(name,remark,userId,userName,addTime,editTime) VALUES(?,?,?,?,?,?)',
    queryByName:'select * from product where name=? and userId=?',
    update:'update user set name=?, age=? where id=?',
    delete: 'delete from user where id=?',
    submit: 'select * from user where name=? and password=?',
    queryAll: 'select * from user',
    queryById: 'select * from user where name=?'
};

module.exports = product;