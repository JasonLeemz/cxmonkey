let qn = require('qiniu'),
    config = require('../config/config')

//需要填写你的 Access Key 和 Secret Key
qn.conf.ACCESS_KEY = config.qnACCESS_KEY;
qn.conf.SECRET_KEY = config.qnSECRET_KEY;


let mqiniu = {
    uptoken: (bucket, key)=> {
        let putPolicy = new qn.rs.PutPolicy(bucket + ":" + key);
        return putPolicy.token();
    },
    uploadFile: (bucket, saveName, localFile)=> {
        let uptoken = mqiniu.uptoken(bucket, saveName);
        let extra = new qn.io.PutExtra();

        qn.io.putFile(uptoken, saveName, localFile, extra, function (err, ret) {
            if (!err) {
                // 上传成功， 处理返回值
                console.log(ret.hash, ret.key, ret.persistentId, config.qnRES_BASEURL + saveName);
            } else {
                // 上传失败， 处理返回代码
                console.log(err);
            }
        });
    }
};

module.exports = mqiniu;