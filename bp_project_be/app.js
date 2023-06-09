var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const PORT = 8000;
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
var router = express.Router();
const bodyParser = require('body-parser');
var http = require('http');


/* var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users'); */
var apiRouter = require('./routes/api');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('api')
});

app.listen(PORT, () =>{
  console.log("Server listening on port " + PORT);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname + 'public')));

/* app.use('/', indexRouter);
app.use('/users', usersRouter); */
app.use('/api', apiRouter);

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
  //res.render('error');
  console.log('errore pagina');
  res.send(JSON.stringify(err));
});

module.exports = app;
