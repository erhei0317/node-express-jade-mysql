var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');   //首页路由，包含底部四个菜单的路由
var users = require('./routes/users');    //平台用户
var agents = require('./routes/agents');   //代理管理
var levels = require('./routes/levels');   //界别管理
var products = require('./routes/products');   //产品管理
var deals = require('./routes/deals');   //进出货管理
var statisticss = require('./routes/statisticss');   //进出货统计管理
var agency = require('./routes/agency');   //代理管理
var wechat = require('./routes/wechat');   //微信接口管理
var bank = require('./routes/bank');   //微信接口管理

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 输出日志到目录
var fs = require('fs');
var accessLogStream = fs.createWriteStream(__dirname + '/log/access.log', {flags: 'a',  encoding:'utf8'}); // 记得要先把目录建好，不然会报错
app.use(logger('combined', {stream: accessLogStream}));

app.use(session({   //session初始化
  resave: false,//添加这行
  saveUninitialized: true,//添加这行
  secret: 'secret',
  rolling: true,   //刷新后session有效期重置，saveUninitialized必须为true，不然无效
  cookie:{
    //expires: new Date(Date.now() + 1000*10),     //session有效期，页面刷新后会重新计算
    maxAge: 1000*60*30      //有效时间，貌似和expire一样
  }
}));
app.use('/', routes);
app.use('/wechat', wechat); // 自定义cgi路径   定义在app.all前面可以不需要验证session，因为关注那些操作不需要验证session（即登录）
//在所有路由之前加一个登录的拦截，如果没登录，则跳转到home，登录后会将向session存入user属性
app.all('*', function(req, res, next) {
  req.session.name = 'dearpiggy';
  req.session.uid = '2';
  if(!req.session.name||!req.session.uid){
    res.render('fail', {title: '登录超时', msg: '请重新从公众号菜单进入',  backUrl:''});      //当前id查询不到数据，返回数据异常页面
  }else{
    next();
  }
});
app.all('/bank/*', function(req, res, next) {
  req.session.isBank = 1;
  if(req.session.isBank!=1){
    res.render('fail', {title: '没有权限', msg: '您没有权限使用当前功能哦，请联系管理员购买激活码！',  backUrl:''});      //当前id查询不到数据，返回数据异常页面
  }else{
    next();
  }
});
app.use('/users', users); // 自定义cgi路径
app.use('/agents', agents); // 自定义cgi路径
app.use('/levels', levels); // 自定义cgi路径
app.use('/products', products); // 自定义cgi路径
app.use('/deals', deals); // 自定义cgi路径
app.use('/statisticss', statisticss); // 自定义cgi路径
app.use('/agency', agency); // 自定义cgi路径
app.use('/bank', bank); // 自定义cgi路径


// catch 404 and forward to error handler
app.use(function(req, res, next) {      //访问地址不存在时进入这里
  var err = new Error('Not Found');
  err.status = 404;
  req.session.error = '您所访问的地址不存在';
  //res.redirect("/fail");
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title: '出错啦',
      message: err.message,
      error: err
    });
    //res.render('fail', { title:'404', msg: '您所访问的地址不存在', backUrl:'/'});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: '出错啦',
    message: err.message,
    error: {}
  });
  //res.render('fail', { title:'404', msg: '您所访问的地址不存在', backUrl:'/'});
});


module.exports = app;
