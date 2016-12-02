/**
 * Created by jason on 2016/11/21.
 */
let config = require('../config/config'),
    redis = require('redis'),
    RDS_PORT = config.redisPORT,        //端口号
    RDS_HOST = config.redisHOST,    //服务器IP
    RDS_PWD = config.redisPWD,
    RDS_OPTS = {auth_pass: RDS_PWD},            //设置项
    client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);


module.exports = client.on('connect', function () {
    return client;
});