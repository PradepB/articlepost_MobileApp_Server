var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var logger = require('morgan');
var mongo = require("./config/dbConfig")
var tokenGen = require('./routes/tokenGenration');
var usersRouter = require('./routes/users');
var auth = require('./middlewares/auth')
var upload = require('./routes/upload')
var secretKey = require("./config/config")
require('dotenv').config();

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var jwt = require('jsonwebtoken');


app.startMongoDB = function (host) {
  mongo.initialize(process.env.DB, host, function (err, res) {
    if (err) console.log(err);
  });
};

app.use(function (req, res, next) {
  res.io = io;
  next();
})
app.use(cors());
app.options('*', cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public/'))
app.use(express.static(__dirname + '/uploads/'))


// app.use(cookieParser());

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
app.use(function (req, res, next) {


  res.header("Access-Control-Allow-Origin", '*');
  res.header('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE');
  res.header("Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Accept, Origin, Authorization, X-Requested-With, x-auth-token");
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});


app.use('/tokenGen', tokenGen);
app.use('/users',  auth, usersRouter);
app.use('/uploadImg', upload)



app.get('*', (req, res) => {
  res.send("hello")
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// module.exports = app;
module.exports = { app: app, server: server };
