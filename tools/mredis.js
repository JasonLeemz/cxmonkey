/**
 * Created by jason on 2016/11/21.
 */

var redis = require('redis'),
    RDS_PORT = 6379,        //端口号
    RDS_HOST = '127.0.1.1',    //服务器IP
    RDS_PWD = 'MhxzKhl',
    RDS_OPTS = {auth_pass: RDS_PWD},            //设置项
    client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);


module.exports = client.on('connect', function () {
    return client;
});