let express = require('express');
let app = express();
let crypto = require('crypto');

function sha1(str) {
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}

app.get('/checkSignature', function (req, res) {

    let signature = req.query.signature;
    let timestamp = req.query.timestamp;
    let nonce = req.query.nonce;
    let token = 'cxmonkey2015_limingze';
    let echostr = req.query.echostr;

    let tmpArr = [token, timestamp, nonce];
    tmpArr.sort();

    let tmpStr = tmpArr.join('');
    console.log(tmpStr);
    tmpStr = sha1(tmpStr);
    console.log(tmpStr);

    if( tmpStr == signature ){
        res.send(echostr);
    }else{
        res.send('error');
    }
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('http://%s:%s', host, port);
});
