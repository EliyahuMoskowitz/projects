var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactsRouter = require('./routes/contacts');
var gamesRouter = require('./routes/games');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contacts', contactsRouter);
app.use('/games', gamesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  res.redirect('/');    //for the react router confusing server
});

// global.contactsUsername = input();
// const mysql = require('mysql');
// const mysqlConnection = mysql.createConnection({
//   host: 'localhost',
//   user: 'nodeuser',
//   password: 'test123',
//   database: 'nodeuser'
// });

// mysqlConnection.connect();
// // mysqlConnection.end();
// //WRONG - TEMPORARY
// global.db = mysqlConnection;

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('layout', {title: 'Error in Our Projects', partials: {content: 'error'}});
});

module.exports = app;
