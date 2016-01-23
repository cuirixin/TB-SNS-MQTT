var request = require('request');
var config = require('../config');

// 解决中文问题
exports._nativeConvertAscii = function (str) {
    var ascii = '';
    for(var i = 0; i != str.length; i++) {
        var code = Number(str[i].charCodeAt(0));
        if(code > 127) {
            charAscii = code.toString(16);
            charAscii = new String("0000").substring(charAscii.length, 4) + charAscii
            ascii += "\\u" + charAscii;
        } else {
            ascii += str[i]
        }
    }

    return ascii;
}

exports.push_Apple_msg = function(token_str, title, msg, num, extra){
    console.log("Push Apple Msg: ", token_str, extra.code);

    timestamp = Date.now().toString();
    appkey = config.umeng.message.ios.AppKey;

    //console.log("appkey: ", appkey);
    app_master_secret = config.umeng.message.ios.AppMasterSecret;
    url = "http://msg.umeng.com/api/send";
    method = 'POST';

    console.log('production_mode: ', config.umeng.production_mode);

    params = {
      "appkey": appkey, 
      "timestamp": timestamp,
      "type":"unicast",
      "device_tokens":token_str,  
      'production_mode': config.umeng.production_mode, // 开发环境下必须传值false，否则默认为发布环境
      "payload": { 
        "aps": {
            "alert": msg,
        },
        "extra": extra,
        "title": title
      }
    }

    post_body = JSON.stringify(params);

    post_body = exports._nativeConvertAscii(post_body)

    //console.log(post_body);

    sign = utils.md5_encode(method + url + post_body + app_master_secret);

    //console.log("sign: ", sign);

    url = url+"?sign="+sign;

    request.post({url: url, form: post_body}, function(err, httpResponse, body){
        if(err){
            console.log(err);
        }
        console.log(body);
    })
};

exports._push_Android_msg = function(token_str, title, msg, extra){
    console.log("Push Android Msg.");
    console.log(token_str, title, msg, extra);
};

exports._push_notification = function (device, token_str, title, content, extra) {
    if (!token_str){
        return;
    }

    if (device == 'IOS'){
        exports._push_Apple_msg(token_str, title, content, 1, extra)
    }else{
        exports._push_Android_msg(token_str, title, content, extra)
    }

};