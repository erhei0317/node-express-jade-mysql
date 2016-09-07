// dao/userSqlMapping.js
// CRUD SQL语句
var product = {
    add:'INSERT INTO product(name,remark,userId,userName,addTime,editTime,totalCount) VALUES(?,?,?,?,?,?,0)',
    queryByName:'select userId from product where name=? and userId=?',
    queryAll: 'select id,name,totalCount,remark from product where userId=?',
    queryById: 'select id,name,totalCount,remark from product where id=? and userId=?',
    edit:'update ignore product set name=?, remark=?, editTime=? where id=? and userId=?',
    delete: 'delete from product where id=? and userId=?',
};

module.exports = product;