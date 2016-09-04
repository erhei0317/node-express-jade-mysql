// dao/userSqlMapping.js
// CRUD SQL语句
var user = {
    add:'INSERT INTO user(id, name, age) VALUES(0,?,?)',
    update:'update user set name=?, age=? where id=?',
    delete: 'delete from user where id=?',
    submit: 'select * from user where name=? and password=?',
    queryAll: 'select * from user',
    queryById: 'select * from user where name=?'
};

module.exports = user;