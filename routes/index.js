var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    // console.log(req.host);
    console.log(111111111111111)
    res.render('index', {title: '爱上进的程序猿'});
});

router.post('/', function (req, res, next) {
    // console.log(req.hostname)
    console.log(111111111111111)
    console.log(req)
    //
    // let textTpl = `
    // <xml>
    //     <ToUserName><![CDATA[%s]]></ToUserName>
    //     <FromUserName><![CDATA[%s]]></FromUserName>
    //     <CreateTime>%s</CreateTime>
    //     <MsgType><![CDATA[%s]]></MsgType>
    //     <Content><![CDATA[%s]]></Content>
    //     <FuncFlag>0</FuncFlag>
    // </xml>
    // `;
    // console.log(textTpl)
    // res.send(textTpl);
});

module.exports = router;
