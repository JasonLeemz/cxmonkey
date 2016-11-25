/**
 * Created by jason on 2016/11/16.
 */
let https = require('https'),
    util = require('util'),
// require('Promise');
// let request = require('request');
// let querystring = require('querystring');
    rdsClient = require('../tools/mredis'),
    wxcode = require('./wxcode')

let token = {
    getContent: function (url) {
        // return new pending promise
        return new Promise((resolve, reject) => {
            // select http or https module, depending on reqested url
            const lib = url.startsWith('https') ? require('https') : require('http');
            const request = lib.get(url, (response) => {
                // handle http errors
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error('Failed to load page, status code: ' + response.statusCode));
                }
                // temporary data holder
                const body = [];
                // on every content chunk, push it to the data array
                response.on('data', (chunk) => body.push(chunk));
                // we are done, resolve promise with those joined chunks
                response.on('end', () => resolve(body.join('')));
            });
            // handle connection errors of the request
            request.on('error', (err) => reject(err))
        })
    },

    getWxACT: function () {
        const appid = "wx06b9fd14ac0e7660";
        const secret = "b1059e82f499505648ebcd9f875461a9";
        const actHost = "api.weixin.qq.com";
        const actPath = "/cgi-bin/token?grant_type=client_credential&appid=" + appid + "&secret=" + secret;

        // var contents = querystring.stringify({
        //     name: 'joey',
        //     email: 'joey@joey.com',
        //     address: 'joey university'
        // });

        var options = {
            host: actHost,
            path: actPath,
            method: 'POST',
            headers: {
                'Content-Type': 'Content-type: text/html',
                // 'Content-Length': contents.length
            }
        };

        // this.getContent(actHost+actPath)
        //     .then((html) => {
        //         // console.log(html);
        //         return html;
        //     })
        //     .catch((err) => console.error(err));
        //
        return new Promise(function (resolve, rej) {
            rdsClient.select(1, (error)=> {
                if (error) {
                    util.log('rdsClient ERROR: ' + error);
                } else {
                    rdsClient.get('wxact', function (error, res) {
                        if (error) {
                            console.log('wxact', error);
                        } else {
                            if (res) { // 从redis中取
                                resolve(res);
                            } else { // 从weixin接口取
                                var req = https.request(options, function (res) {
                                    res.setEncoding('utf8');
                                    res.on('data', function (chunk) {
                                        let resObj = JSON.parse(chunk.toString("utf-8"));
                                        if(resObj["errcode"] != 0){
                                            console.log(wxcode[resObj["errcode"]]);
                                            resolve(wxcode[resObj["errcode"]]);
                                        }else{
                                            resolve(resObj["access_token"]);
                                            //写入redis
                                            // Set a value
                                            rdsClient.set('wxact', resObj["access_token"], rdsClient.print);
                                            // Expire in 3 seconds
                                            rdsClient.expire('wxact', resObj["expires_in"]);
                                        }
                                    });
                                    // resolve(res);
                                    res.on('error', function (err) {
                                        util.log('RESPONSE ERROR: ' + err);
                                        reject(err);
                                    });

                                });
                                req.on('error', function (err) {
                                    util.log('REQUEST ERROR: ' + err);
                                    reject(err);
                                });
                                req.end();  //不能漏掉，结束请求，否则服务器将不会收到信息。
                            }
                        }

                        // 关闭链接
                        // rdsClient.end();
                    });
                }
            });

        });
    }
};


module.exports = token;