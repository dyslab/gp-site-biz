/* eslint-disable */
const path = require('path');
const createError = require('http-errors');
const express = require('express');
const app = express();

const APP_FOLDER = 'dist/';
const APP_PORT = 8060;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'server', 'views'));
app.use('/dist', express.static(APP_FOLDER));

app.get('/', (req, res) => {
  res.render('index', { title:'INDEX' });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'ERROR' });
})

console.log(`Web Server Started. Serving Link: [\x1b[32mhttp://localhost:${APP_PORT}/dist/\x1b[0m]\n`);
console.log(`Ctrl + C to Exit...\n`);

app.listen(APP_PORT);
