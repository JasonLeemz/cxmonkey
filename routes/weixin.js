/**
 * Created by jason on 2016/11/11.
 */
var express = require('express');
var router = express.Router();
let check = require('../tools/check');

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log("GET:" + req.hostname);
    console.log(req.body);
    res.send(req.query.echostr);
});

router.post('/', function (req, res, next) {
    console.log("originalUrl:\n" + req.originalUrl);
    console.log("path:\n" + req.path);
    console.log("body:\n" , req.body);
    console.log("content:\n" + req.body.xml.content[0]);

    res.send(req.query.echostr);
});

module.exports = router;