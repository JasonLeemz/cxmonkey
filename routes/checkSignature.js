/**
 * Created by jason on 2016/11/8.
 */
var express = require('express');
var router = express.Router();
let check = require('../tools/check');

function sha1(str) {
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    // console.log(req.host)
    // console.log(req.query)
    let signature = req.query.signature;
    let timestamp = req.query.timestamp;
    let nonce = req.query.nonce;
    let echostr = req.query.echostr;

    let checkRes = check.weixin(signature,timestamp,nonce);

    if(checkRes){
        res.send(echostr);
    }else{
        res.send('error');
    }
});

router.post('/', function(req, res, next) {
    // console.log(req.host)
    // console.log(req.query)
    let signature = req.query.signature;
    let timestamp = req.query.timestamp;
    let nonce = req.query.nonce;
    let echostr = req.query.echostr;

    let checkRes = check.weixin(signature,timestamp,nonce);

    if(checkRes){
        res.send(echostr);
    }else{
        res.send('error');
    }
});

module.exports = router;