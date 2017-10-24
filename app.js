var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHBS = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var mongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var userRoutes = require('./routes/user');

var app = express();

//Connection to mongoDB
mongoose.connect('localhost:27017/shopping');

//load passport
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHBS(
    {defaultLayout: 'layout', extname: '.hbs'}
));
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//Run body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Validator run
app.use(validator());
//Run cookie parser
app.use(cookieParser());

//Initializing session
app.use(session(
    {
        secret: 'SuperSecretSessionKey',
        resave: false,
        saveUninitialized: false,
        store: new mongoStore({mongooseConnection: mongoose.connection}),
        cookie: {maxAge: 180 * 60 * 1000}
        //Test by using "cookie: {maxAge: 10 * 60 * 1000}" cookie expire 10 secs
    }));
//Initialize flash messages
app.use(flash());
//Initialize passport
app.use(passport.initialize());
app.use(passport.session());
//serving pages from public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next)
    {
        //A global var for logged in, accessible in all views
        res.locals.login = req.isAuthenticated();
        //A global var for session to be passed, accessible in all views
        res.locals.session = req.session;
        next();
    }
);

//check prefix and redirect to userRoutes
app.use('/user', userRoutes);
//serve homepage
app.use('/', index);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
//Rupee symbol: ₹ (DELETE AFTER)