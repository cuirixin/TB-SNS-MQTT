//var mqtt = require('mqtt');
var nodemailer = require('nodemailer');
var request = require('request');
var config = require('./config');
var utils = require('./lib/utils');
require('./lib/MSG_NOTIFICATION_I18N');
var mongoose = require('mongoose');
var user_model = require('./models/user');

// 不需要离线消息，cleanSession设置为true
//var mqtt_cli  = mqtt.connect(config.mqtt_url, {clean:true}); // test.mosquitto.org

/**
* 即时消息
exports.user_im = function (uid, msg) {
	console.log("Engine user_im");
	var topic = "noti/"+uid;
	var message = {
		"code": global.Sys.cont.CODE_USER_IM, 
		"module": global.Sys.cont.MODULE_IM
	};
	exports._publish_mqtt(topic, message);
};
*/

/**
* 申请好友
exports.apply_for_friend = function (uid, msg) {
	console.log("Engine apply_for_friend");
	var topic = "noti/"+uid;
	var message = {
		"code": global.Sys.cont.CODE_ADD_FRIEND_REQUEST, 
		"module": global.Sys.cont.MODULE_FRIEND
	};
	exports._publish_mqtt(topic, message);
};
*/

/**
* 发送找回密码邮件
*/
exports.send_forget_pwd_email = function (email, url, lang) {
	console.log("Engine send_forget_pwd_email");
	html = "Reset password：<a href='"+url+"'>Press</a>";
	
	switch (lang) {
		case 'zh-CN':
			html = "重新设置密码：<a href='"+url+"'>请点击这里设置</a>";
			break;
		default:
			console.log("Unkown lang: " + lang);
	}

	exports._send_email(email, "Exblorer Reset Password", html);
};


/**
* 申请好友
*/
exports.apply_for_friend = function (uid, msg) {
	console.log("Engine apply_for_friend");
	//console.log(msg);

	user_model.get_valid_token(uid, function(err, token){
		if(err){
			console.log("Get token error, ", err);
			return;
		}

		if (token){

			// TODO 这里有个BUG，token.lang一直为空，采用下面方式解决的，问题未知
			token = JSON.parse(JSON.stringify(token));

			var title = MSG_NOTIFICATION_I18N.apply_for_friend.title.en;
			var content = MSG_NOTIFICATION_I18N.apply_for_friend.content.en;

			if (token.lang && MSG_NOTIFICATION_I18N.apply_for_friend.title[token.lang]){
				title = MSG_NOTIFICATION_I18N.apply_for_friend.title[token.lang];
				content = MSG_NOTIFICATION_I18N.apply_for_friend.content[token.lang];
			}

			//console.log(token.device, title, content);

			exports._push_notification(token.device, token.token, title, content, msg.extra);
			
		}else{
			console.log("No token");
		}

		
	});

};


/**
* 新回复
*/
exports.subject_response = function (uid, msg) {
	//console.log("Engine subject_response");
	//console.log(msg);

	user_model.get_valid_token(uid, function(err, token){
		if(err){
			console.log("Get token error, ", err);
			return;
		}

		if (token){

			// TODO 这里有个BUG，token.lang一直为空，采用下面方式解决的，问题未知
			token = JSON.parse(JSON.stringify(token));

			var title = MSG_NOTIFICATION_I18N.new_subject_response.title.en;
			var content = MSG_NOTIFICATION_I18N.new_subject_response.content.en;

			//console.log(token.lang, MSG_NOTIFICATION_I18N.new_subject_response.title[token.lang]);
			
			if (token.lang && MSG_NOTIFICATION_I18N.new_subject_response.title[token.lang]){
				title = MSG_NOTIFICATION_I18N.new_subject_response.title[token.lang];
				content = MSG_NOTIFICATION_I18N.new_subject_response.content[token.lang];
			}

			//console.log(token.device, title, content);

			exports._push_notification(token.device, token.token, title, content, msg.extra);
			
		}else{
			console.log("No token");
		}

		
	});

};

/**
* 新回复
exports.subject_response = function (uid, msg) {
	console.log("Engine subject_response");
	var topic = "noti/"+uid;
	var message = {
		"code": global.Sys.cont.CODE_NEW_SUBJECT_RESPONSE, 
		"module": global.Sys.cont.MODULE_RESPONSE
	}
	exports._publish_mqtt(topic, message);
};
*/

/**
* 系统消息
exports.system_msg = function (uid, msg) {
	console.log("Engine system_msg");
	var topic = "noti/"+uid;
	var message = {
		"code": global.Sys.cont.CODE_NEW_SUBJECT_RESPONSE, 
	}
	exports._publish_mqtt(topic, message);
};
*/

/**
* 新粉丝
*/
exports.follow_friend = function () {
	console.log("Engine follow_friend");
};

/*
exports._publish_mqtt = function (topic, message, qos) {
	if(!qos){
		qos = 0;
	}

	console.log(topic);

	if(typeof message  == 'object'){
		message = JSON.stringify(message);
	}
	mqtt_cli.publish(topic, message, {qos: 0});
	//mqtt_cli.end();
};
*/

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

exports._push_Apple_msg = function(token_str, title, msg, num, extra){
	console.log("Push Apple Msg: ", token_str, extra.code);

	timestamp = Date.now().toString();
    appkey = config.umeng.message.ios.AppKey;

    //console.log("appkey: ", appkey);
    app_master_secret = config.umeng.message.ios.AppMasterSecret;
    url = "http://msg.umeng.com/api/send";
    method = 'POST';

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


/*

var SDK = require('umeng-node-sdk');

exports._push_Apple_msg = function(token_str, title, msg, num, extra){
	console.log("Push Apple Msg.");

	console.log(config.umeng.message.ios.AppKey, config.umeng.message.ios.AppMasterSecret);

	var ios = SDK({ 
	    platform: 'ios',
	    appKey: config.umeng.message.ios.AppKey,
	    appMasterSecret: config.umeng.message.ios.AppMasterSecret
	});

	console.log(ios);

	var info = {
	    timestamp: Date.now(),
	    device_tokens: token_str,  // 64-length token
	    payload: {
	        aps: {
	            alert: msg,
	        },
	        extra: {},
	        title: title
	    },
	    production_mode: "false" // 开发环境下必须传值false，否则默认为发布环境
	};

	ios.unicast(info, function(err, httpResponse, result) {
	    if(err) console.log(err);

	    console.log(result);
	});
	
	
};
*/
exports._push_Android_msg = function(token_str, title, msg, extra){
	console.log("Push Android Msg.");
	console.log(token_str, title, msg, extra);
};


// create reusable transporter object using the default SMTP transport 
var transporter = nodemailer.createTransport('smtps://no-reply@tubban.com:chino2014@smtp.exmail.qq.com');

exports._send_email = function(to, subject, html){
	var mailOptions = {
	    from: 'Exblorer一步 <no-reply@tubban.com>', // sender address 
	    to: to, // list of receivers 
	    subject: subject, // Subject line 
	    text: '', // plaintext body 
	    html: html // html body 
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
}

