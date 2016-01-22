var crypto = require('crypto');

exports.pwd_encode = function(s){
    var b = new Buffer(s);
    var s = b.toString('base64');
    var b64 = new Buffer(s, 'base64');
    nike = b64.toString('hex');
    password = exports.md5_encode(nike);
    return {nike: nike, password: password};
}

exports.md5_encode = function(s){
    var md5 = crypto.createHash('md5');
    md5.update(s);
    return md5.digest('hex');
}