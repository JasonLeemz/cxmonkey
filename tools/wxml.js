/**
 * Created by jason on 2016/11/21.
 */
var sprintf = require("sprintf-js").sprintf,
    vsprintf = require("sprintf-js").vsprintf,
    mcurl = require("./mcurl"),
    crc32 = require('crc-32'),
    wxemoji = require('./wxemoji')

/* eg:
 sprintf("%2$s %3$s a %1$s", "cracker", "Polly", "wants")
 vsprintf("The first 4 letters of the english alphabet are: %s, %s, %s and %s", ["a", "b", "c", "d"])
 */

var wxXml = {
    text: function (matchObj) {
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

        if (matchObj["content"]) {
            if((matchObj["content"] === '【收到不支持的消息类型，暂无法显示】')){
                return new Promise((resolve, reject) => {
                    matchObj["cont"] = '【你的消息已发送但是对方拒收并对你扔了一个板砖】';
                    cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, matchObj["cont"]]);
                    resolve(cont);
                });
            }else if(wxemoji.obj.hasOwnProperty(matchObj["content"])){
                return new Promise((resolve, reject) => {
                    matchObj["cont"] = wxemoji.array[parseInt(Math.random(wxemoji.array.length-1)*10)];
                    cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, matchObj["cont"]]);
                    resolve(cont);
                });
            }else{
                try {
                    return new Promise((resolve, reject) => {
                        this.robot(matchObj['content'], matchObj['tousername']).then((res)=> {
                            cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, res]);
                            resolve(cont);
                        });
                    });
                } catch (e) {
                    console.log(e);
                }
            }

        } else {
            return new Promise((resolve, reject) => {
                matchObj["cont"] = '完全不晓得你在讲啥！';
                cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, matchObj["cont"]]);
                resolve(cont);
            });

        }
    },
    image: function () {
        let cont = `
                    <xml>
                    <ToUserName><![CDATA[%s]]></ToUserName>
                    <FromUserName><![CDATA[%s]]></FromUserName>
                    <CreateTime>%s</CreateTime>
                    <MsgType><![CDATA[image]]></MsgType>
                    <Image>
                    <MediaId><![CDATA[{MediaId}]]></MediaId>
                    </Image>
                    </xml>
        `;
        let createTime = parseInt(new Date().getTime() / 1000);
        // createTime = createTime.substr(0,10);
        cont = vsprintf(cont, [matchObj['tousername'], matchObj["fromusername"], createTime, matchObj["cont"]]);
        return cont;
    },
    robot: function (keywords, userid) {
        userid = userid ? userid : '';

        //聚合数据
        //配置您申请的appkey
        let appkey = "1f35ddeef50593d78286ca47a20893cc";
        let url = "http://op.juhe.cn/robot/index";
        let params = {
            'key': appkey,//您申请到的本接口专用的APPKEY
            'info': keywords,//要发送给机器人的内容，不要超过30个字符
            'dtype': 'json',//返回的数据的格式，json或xml，默认为json
            'loc': '',//地点，如北京中关村
            'lon': '',//经度，东经116.234632（小数点后保留6位），需要写为116234632
            'lat': '',//纬度，北纬40.234632（小数点后保留6位），需要写为40234632
            'userid': Math.abs(crc32.str(userid, crc32)),//1~32位，此userid针对您自己的每一个用户，用于上下文的关联
        };
        let paramstring = "";
        for (let key in params) {
            paramstring += key + "=" + encodeURI(params[key]) + "&";
        }
        paramstring = paramstring.substring(0,paramstring.length-1);
        console.log(paramstring);
        url += "?" + paramstring;

        return new Promise((resolve, reject) => {
            mcurl.getContent(url).then((res)=> {
                res = JSON.parse(res);
                if (res['error_code'] == '0') {
                    // console.log(res["result"]["text"]);
                    resolve(res["result"]["text"]);
                } else {
                    reject(res["reason"]);
                }
            });
        });


    }
};


module.exports = wxXml;
