// dao/userSqlMapping.js
// CRUD SQL语句
var index = {
    getUserById:'select * from user where id=? and wxOpenId=?',
};

module.exports = index;