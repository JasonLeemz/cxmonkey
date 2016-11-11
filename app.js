let express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    concat = require('concat-stream'),
    xmlparser = require('express-xml-bodyparser'),
    check = require('./tools/check'),
    weixin = require('./routes/weixin'),
    index = require('./routes/index'),

    app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(xmlparser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    let signature = req.query.signature;
    let timestamp = req.query.timestamp;
    let nonce = req.query.nonce;

    let checkRes = check.weixin(signature, timestamp, nonce);
    if (!checkRes) {
        res.send('error');
    } else {
        next();
    }
});

app.use('/receive-xml', xmlparser({trim: false, explicitArray: false}), function (req, res, next) {
    req.pipe(concat(function (data) {
        req.body = data;
        next();
    }));
});

app.use('/', weixin);
app.use('/index', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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


module.exports = app;
