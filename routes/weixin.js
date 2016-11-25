/**
 * Created by jason on 2016/11/11.
 */
let express = require('express'),
    router = express.Router(),
    check = require('../tools/check'),
    actoken = require('../tools/token'),
    wxml = require('../tools/wxml'),

    util = require('util')


/* GET home page. */
router.get('/', function (req, res, next) {
    console.log("GET:" + req.hostname);
    console.log(req.body);
    res.send(req.query.echostr);
});

router.post('/', function (req, res, next) {
    util.log(req.body);
    switch (req.body.xml.msgtype[0]) {
        case 'event':
            if (req.body.xml.event[0] === 'subscribe') { //关注事件
                actoken.getWxACT()
                    .then((act)=> {
                        // console.log(act);

                        //关注自动回复
                        let msg = wxml.text({
                            'tousername': req.body.xml.fromusername[0],
                            'fromusername': req.body.xml.tousername[0],
                            'cont': '感谢关注，欢迎调戏！\n博客地址：http://www.cnblogs.com/JasonLeemz/',
                        });
                        // util.log(msg);
                        res.send(msg);
                    });

            } else { //取消关注事件
                res.send();
            }
            break;
        case 'text':
            wxml.text({
                'tousername': req.body.xml.fromusername[0],
                'fromusername': req.body.xml.tousername[0],
                'content': req.body.xml.content[0],
                'msgid': req.body.xml.msgid[0],
            }).then((result)=> {
                console.log(result);
                res.send(result);
            });

            break;
        case 'image':
            wxml.image({
                'tousername': req.body.xml.fromusername[0],
                'fromusername': req.body.xml.tousername[0],
                'picurl': req.body.xml.picurl[0],
                'msgid': req.body.xml.msgid[0],
                'mediaid': req.body.xml.mediaid[0],
            }).then((result)=> {
                console.log(result);
                res.send(result);
            });

            break;
        case 'location':
            wxml.location({
                'tousername': req.body.xml.fromusername[0],
                'fromusername': req.body.xml.tousername[0],
                'location_x': req.body.xml.location_x[0],
                'location_y': req.body.xml.location_y[0],
                'scale': req.body.xml.scale[0],
                'label': req.body.xml.label[0],
                'msgid': req.body.xml.msgid[0],
            }).then((result)=> {
                console.log(result);
                res.send(result);
            });

            break;
    }


    // console.log("originalUrl:\n" + req.originalUrl);
    // console.log("path:\n" + req.path);
    // console.log("body:\n" , req.body);
    // console.log("content:\n" + req.body.xml.content[0]);
    // console.log("content:\n" + req.body.xml.msgtype[0]);
    //
    // res.send(req.query.echostr);
});

module.exports = router;