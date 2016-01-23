var config = require('../config');

var rongSDK = require( 'rongcloud-sdk' );
rongSDK.init( config.rongcloud.APP_KEY, config.rongcloud.APP_SECRET );

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


exports.get_token = function (uid, username, avator_url) {
    rongSDK.user.getToken( uid, username, avator_url, function( err, resultText ) {
      if( err ) {
        // Handle the error
        console.error(err);
        return null;
      }
      else {
        var result = JSON.parse( resultText );
        if( result.code === 200 ) {
          return result.token;
        }
        return null;
      }
    } );
}

// objectName 自定义为：RC:EBFriendMsg - 好友消息   RC:EBResponseMsg - 回复消息
exports.message_system_publish = function (fromUserId, toUserIds, objectName, content, pushContent, pushData) {


    console.log(fromUserId, toUserIds, objectName);
    
    //[testConfig.message.fromUserId, [testConfig.message.toUserId], 'RC:TxtMsg', JSON.stringify( { content : 'Hello, world!' } )];

    rongSDK.message.system.publish( fromUserId, toUserIds, objectName, content, pushContent, pushData, function( err, resultText ) {
      if( err ) {
        // Handle the error
        console.error(err);
        return null;
      }
      else {
        var result = JSON.parse( resultText );
        console.log(result);
        if( result.code === 200 ) {

          return result;
        }
        return null;
      }
    } );
}


exports._push_notification = function (uid, content, extra) {
    if (!token_str){
        return;
    }
    console.log("Rongcloud push notification.");
    console.log(uid, content, extra);

};