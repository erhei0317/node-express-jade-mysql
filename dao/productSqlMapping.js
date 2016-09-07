// dao/userSqlMapping.js
// CRUD SQL语句
var product = {
    add:'INSERT INTO product(name,remark,userId,userName,addTime,editTime,totalCount) VALUES(?,?,?,?,?,?,0)',
    queryByName:'select userId from product where name=? and userId=?',
    queryAll: 'select id,name,totalCount,remark from product where userId=?',
    queryById: 'select id,name,totalCount,remark from product where id=?',
    edit:'update product set name=?, remark=?, editTime=? where id=?',
    delete: 'delete from product where id=?',
};

module.exports = product;