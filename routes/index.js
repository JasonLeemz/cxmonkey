var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: '爱上进的程序猿'});
});

router.post('/', function (req, res, next) {
    res.render('index', {title: '爱上进的程序猿'});
});

module.exports = router;
