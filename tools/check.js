/**
 * Created by jason on 2016/11/9.
 */
let crypto = require('crypto');

function sha1(str) {
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}

let check = {
    weixin: function (s, t, n) {
        let token = 'cxmonkey2015_limingze';

        let signature = s;
        let timestamp = t;
        let nonce = n;

        let tmpArr = [token, timestamp, nonce];
        tmpArr.sort();

        let tmpStr = tmpArr.join('');
        // console.log(tmpStr);
        tmpStr = sha1(tmpStr);
        // console.log(tmpStr);

        if (tmpStr == signature) {
            return true;
        } else {
            return false;
        }
    }
};


module.exports = check;