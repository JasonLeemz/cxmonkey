/**
 * Created by jason on 2016/11/21.
 */
let sprintf = require("sprintf-js").sprintf,
    vsprintf = require("sprintf-js").vsprintf,
    mcurl = require("./mcurl"),
    crc32 = require('crc-32'),
    wxemoji = require('./wxemoji'),
    rdsClient = require('./mredis'),
    token = require('./token'),
    fs = require('fs'),
    readLastLines = require('read-last-lines'),
    readChunk = require('read-chunk'),
    fileType = require('file-type'),
    util = require('util'),
    wxcode = require('./wxcode'),
    mqiniu = require('./mqiniu'),
    config = require('../config/config')

/* eg:
 sprintf("%2$s %3$s a %1$s", "cracker", "Polly", "wants")
 vsprintf("The first 4 letters of the english alphabet are: %s, %s, %s and %s", ["a", "b", "c", "d"])
 */

var wxXml = {
    text: (matchObj)=> {
        let cont = `
                    <xml>
                    <ToUserName><![CDATA[%s]]></ToUserName>
                    <FromUserName><![CDATA[%s]]></FromUserName>
                    <CreateTime>%s</CreateTime>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[%s]]></Content>
                    </xml>
        `;
        let createTime = parseInt(new Date().getTime() / 1000);

        console.log("send:" + matchObj["content"]);
        // console.log(matchObj["content"].indexOf('发'))
        if (matchObj["content"]) {
            if ((matchObj["content"] === '关注')) {
                return new Promise((resolve, reject) => {
                    console.log("cb:" + matchObj["cont"]);
                    cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, matchObj["cont"]]);
                    resolve(cont);
                });
            }else if ((matchObj["content"] === '【收到不支持的消息类型，暂无法显示】')) {
                return new Promise((resolve, reject) => {
                    matchObj["cont"] = '【你的消息已发送但是对方拒收并对你扔了一个板砖】';
                    console.log("cb:" + matchObj["cont"]);
                    cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, matchObj["cont"]]);
                    resolve(cont);
                });
            }
            // else if (matchObj["content"].indexOf('发') !== -1 && matchObj["content"].indexOf('图片') !== -1) {
            //     return new Promise((resolve, reject) => {
            //         wxApi.getImgList().then((list)=>{
            //             console.log(list)
            //             resolve(list);
            //         });
            //     });
            // }
            else if (matchObj["recognition"] && matchObj["content"] === 'ps') {
                return new Promise((resolve, reject) => {
                    matchObj["cont"] = "我真的已经努力去听了，可是你的声音跟屎一样难以辨认！！！！";
                    console.log("cb:" + matchObj["cont"]);
                    cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, matchObj["cont"]]);
                    resolve(cont);
                });
            } else if (wxemoji.obj.hasOwnProperty(matchObj["content"])) {
                return new Promise((resolve, reject) => {
                    matchObj["cont"] = wxemoji.array[parseInt(Math.random(wxemoji.array.length - 1) * 10)];
                    console.log("cb:" + matchObj["cont"]);
                    cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, matchObj["cont"]]);
                    resolve(cont);
                });
            } else if (matchObj["content"] === 'nohuplog') {
                return new Promise((resolve, reject) => {
                    let filename = "./nodeoutput.log";
                    readLastLines.read(filename, 20)
                        .then((lines) => {
                            matchObj["cont"] = lines.toString('utf-8');
                            cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, matchObj["cont"]]);
                            resolve(cont);
                        });
                });
            } else {
                try {
                    return new Promise((resolve, reject) => {
                        rdsClient.select(1, (error)=> {
                            if (error) {
                                util.log('rdsClient ERROR: ' + error);
                            } else {
                                rdsClient.get('wx_' + matchObj['tousername'], function (error, result) {
                                    if (error) {
                                        console.log('wx_' + matchObj['tousername'], error);
                                    } else {
                                        if (result) {
                                            result = result.split(",");
                                            matchObj['location_x'] = result[0].replace(/\./, "");
                                            matchObj['location_y'] = result[1].replace(/\./, "");
                                            matchObj['label'] = result[2];
                                        }
                                    }

                                    // console.log(matchObj)
                                    wxXml.robot(matchObj).then((res)=> {
                                        console.log("cb:" + res);
                                        cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, res]);
                                        resolve(cont);
                                    }).catch((e)=>{
                                        cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, e]);
                                        reject(cont);
                                    });
                                });
                            }
                        });

                    });
                } catch (e) {
                    console.log(e);
                }
            }

        } else {
            return new Promise((resolve, reject) => {
                matchObj["cont"] = '完全不晓得你在讲啥！';
                console.log("cb:" + matchObj["cont"]);
                cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, matchObj["cont"]]);
                resolve(cont);
            });

        }
    },
    image: (matchObj)=> {
        // let cont = `
        //             <xml>
        //             <ToUserName><![CDATA[%s]]></ToUserName>
        //             <FromUserName><![CDATA[%s]]></FromUserName>
        //             <CreateTime>%s</CreateTime>
        //             <MsgType><![CDATA[image]]></MsgType>
        //             <Image>
        //             <MediaId><![CDATA[%s]]></MediaId>
        //             </Image>
        //             </xml>
        // `;
        let cont = `
                    <xml>
                    <ToUserName><![CDATA[%s]]></ToUserName>
                    <FromUserName><![CDATA[%s]]></FromUserName>
                    <CreateTime>%s</CreateTime>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[%s]]></Content>
                    </xml>
        `;
        let createTime = parseInt(new Date().getTime() / 1000);
        // createTime = createTime.substr(0,10);
        return new Promise((resolve, reject) => {
            // matchObj["mediaid"] = matchObj["mediaid"] || '你的图片很有趣，我留下了';
            matchObj["mediaid"] = '你的图片很有趣，我留下了';
            console.log("cb:" + matchObj["mediaid"]);
            mcurl.getImage(matchObj["picurl"]).then((img)=> {
                var buffer = new Buffer(img, "binary");
                let ft = fileType(buffer);
                // let ft = fileType(new Uint8Array(buffer));
                let fileName = "wx_" + matchObj['msgid'] + "." + ft.ext;
                let saveLocalName = "./public/images/" + fileName;
                fs.writeFile(saveLocalName, img, 'binary', function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        mqiniu.uploadFile('wxreceive', fileName, saveLocalName);
                        console.log("send:" + matchObj["picurl"]);
                    }
                });
            })

            cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, matchObj["mediaid"]]);
            resolve(cont);
        });
    },
    robot: (matchObj)=> {

        //聚合数据
        //配置您申请的appkey
        let appkey = "1f35ddeef50593d78286ca47a20893cc";
        let url = "http://op.juhe.cn/robot/index";
        let params = {
            'key': appkey,//您申请到的本接口专用的APPKEY
            'info': matchObj['content'],//要发送给机器人的内容，不要超过30个字符
            'dtype': 'json',//返回的数据的格式，json或xml，默认为json
            'loc': matchObj['label'] || '',//地点，如北京中关村
            'lon': matchObj['location_y'] || '',//经度，东经116.234632（小数点后保留6位），需要写为116234632
            'lat': matchObj['location_x'] || '',//纬度，北纬40.234632（小数点后保留6位），需要写为40234632
            'userid': Math.abs(crc32.str(matchObj['tousername'], crc32)),//1~32位，此userid针对您自己的每一个用户，用于上下文的关联
        };
        let paramstring = "";
        for (let key in params) {
            paramstring += key + "=" + encodeURI(params[key]) + "&";
        }
        paramstring = paramstring.substring(0, paramstring.length - 1);
        // console.log(params);
        url += "?" + paramstring;

        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                reject('微信让我五秒内回答，臣妾做不到啊！');
            }, config.httpTimeOut);


            if (matchObj['content'].length >= 60) {
                resolve("你太罗嗦了，少发几个字我可以看得懂！！！");
            }
            mcurl.getContent(url).then((res)=> {
                res = JSON.parse(res);
                // console.log(res);
                if (res['error_code'] == '0') {
                    // console.log(res["result"]["text"]);
                    for (let i in res["result"]) {
                        if (i !== 'code' && i !== 'text') {
                            res["result"]["text"] += "\n" + res["result"][i];
                        }
                    }
                    resolve(res["result"]["text"]);
                } else {
                    reject(res["reason"]);
                }
            });
        });
    },
    location: (matchObj)=> {
        return new Promise((resolve, reject) => {
            rdsClient.select(1, (error)=> {
                if (error) {
                    util.log('rdsClient ERROR: ' + error);
                } else {
                    //写入redis
                    // Set a value
                    rdsClient.set('wx_' + matchObj['tousername'], matchObj['location_x'] + "," + matchObj['location_y'] + "," + matchObj['label'], rdsClient.print);
                    // Expire in 3 seconds
                    // rdsClient.expire('wx_' + matchObj['tousername'], 3600);
                }
            });

            let cont = `
                    <xml>
                    <ToUserName><![CDATA[%s]]></ToUserName>
                    <FromUserName><![CDATA[%s]]></FromUserName>
                    <CreateTime>%s</CreateTime>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[%s]]></Content>
                    </xml>
            `;
            let createTime = parseInt(new Date().getTime() / 1000);

            matchObj["cont"] = '您的位置我记住了，以后我都会按照这个地址为您查询信息。如果想更换位置，再发给我一遍位置信息就可以了😃';
            console.log("cb:" + matchObj["cont"] + matchObj['label']);
            cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, matchObj["cont"]]);
            resolve(cont);
        });

    },
    voice: (matchObj)=> {
        matchObj["content"] = matchObj["recognition"];
        return new Promise((resolve, reject) => {
            wxXml.text(matchObj).then((result)=> {
                console.log("send:" + matchObj["content"]);
                resolve(result);
            });
        });

    }
};

let wxApi = {
    recursion: 0,
    getImgList: () => {
        return new Promise((resolve, reject)=> {
            token.getWxACT().then((act)=> {
                // console.log(act);
                let url = "https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=" + act;
                mcurl.getContent(url).then((result)=> {
                    // console.log(JSON.parse(result).errcode);
                    let resObj = JSON.parse(result);
                    if (resObj.errcode == 0) {
                        resolve(result);
                    } else if (wxApi.recursion < 1) {
                        console.log(wxcode[resObj["errcode"]]);
                        wxApi.recursion++;
                        rdsClient.select(1, (error)=> {
                            if (error) {
                                console.log('wxact', error);
                            } else {
                                rdsClient.del('wxact');
                                wxApi.getImgList();
                            }
                        });
                    } else {
                        console.log("被玩坏了");
                    }
                });
            });
        });
    },
}
module.exports = wxXml;
