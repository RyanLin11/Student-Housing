var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var listingRouter = require('./routes/listing')
const mongoose = require('mongoose');

require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Settings setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sessions Management
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({mongoUrl: process.env.ATLAS_URL}),
  saveUninitialized: false,
  resave: false,
}))

// Global middleware
app.get('/*', function (req, res, next) {
  res.locals.authenticated = req.session.loggedIn;
  res.locals.username = req.session.username;
  next();
})

app.get(['/listing/*', '/listing'], function(req, res, next) {
  if(!req.session.loggedIn) {
    res.redirect('/users/login');
  } else {
    console.log('logged in!');
  }
  next();
})

// Router middleware
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/listing', listingRouter);

// Connecting to the Database
mongoose.connect(process.env.ATLAS_URL);

app.listen(3000, () => {
  console.log("Server is running at port 3000");
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
