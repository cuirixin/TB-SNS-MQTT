//var mqtt = require('mqtt');
var nodemailer = require('nodemailer');
var request = require('request');
var config = require('./config');
var util = require('util');
var utils = require('./lib/utils');
require('./lib/MSG_NOTIFICATION_I18N');
var mongoose = require('mongoose');
var user_model = require('./models/user');

var assert = require('assert-plus');

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

// 引入融云推送方案
var notify_engine = require('./lib/notify_rongcloud');

/**
* 申请好友
*/
exports.apply_for_friend = function (uid, msg) {
	console.log("Engine apply_for_friend");

	assert.optionalString(uid, 'uid');
	assert.object(msg, 'options');
    assert.object(msg.extra, 'msg.extra');
    //assert.optionalString(options.socketPath, 'options.socketPath');
    //assert.optionalString(options.url, 'options.url');
    //assert.optionalString(options.version, 'options.version');

	//console.log(msg);

	/* 融云推送方案 */
	user_model.get_valid_token(uid, function(err, token){
		if(err){
			console.log("Get token error, ", err);
			return;
		}

		if (token){

			// TODO 这里有个BUG，token.lang一直为空，采用下面方式解决的，问题未知
			token = JSON.parse(JSON.stringify(token));

			var username = util.format("%s %s", msg.extra.sender.realname[1], msg.extra.sender.realname[0]);
			var text = msg.extra.message;

			var title = MSG_NOTIFICATION_I18N.apply_for_friend.title.en;
			var content = util.format(MSG_NOTIFICATION_I18N.apply_for_friend.content.en, username, text) ;

			if (token.lang && MSG_NOTIFICATION_I18N.apply_for_friend.title[token.lang]){
				title = MSG_NOTIFICATION_I18N.apply_for_friend.title[token.lang];
				content = util.format(MSG_NOTIFICATION_I18N.apply_for_friend.content[token.lang], username, text);
			}

			//console.log(token.device, title, content);
			var fromUserId = "user-" + config.rongcloud.ADMIN_FRIEND_ID;
			var toUserIds = ["user-" + msg.receiver];
			var objectName = config.rongcloud.SELF_DEFINED_MSGTYPE.FRIEND;
			var pushData = {
				"code": msg.extra.code
			};

			notify_engine.message_system_publish(fromUserId, toUserIds, objectName, content, content, pushData);

			
		}else{
			console.log("No token");
		}
		
	});

	/* 友盟推送方案：
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
	*/

};


/**
* 新回复
*/
exports.subject_response = function (uid, msg) {
	//console.log("Engine subject_response");
	//console.log(msg);

	assert.optionalString(uid, 'uid');
	assert.object(msg, 'options');
    assert.object(msg.extra, 'msg.extra');

    //console.log(msg);

	/* 融云推送方案 */
	user_model.get_valid_token(uid, function(err, token){
		if(err){
			console.log("Get token error, ", err);
			return;
		}

		if (token){

			//console.log(token);

			// TODO 这里有个BUG，token.lang一直为空，采用下面方式解决的，问题未知
			token = JSON.parse(JSON.stringify(token));

			var username = util.format("%s %s", msg.extra.sender.realname[1], msg.extra.sender.realname[0]);
			var text = msg.extra.response.content;

			var title = MSG_NOTIFICATION_I18N.new_subject_response.title.en;
			var content = util.format(MSG_NOTIFICATION_I18N.new_subject_response.content.en, username, text) ;

			if (token.lang && MSG_NOTIFICATION_I18N.new_subject_response.title[token.lang]){
				title = MSG_NOTIFICATION_I18N.new_subject_response.title[token.lang];
				content = util.format(MSG_NOTIFICATION_I18N.new_subject_response.content[token.lang], username, text);
			}

			//console.log(token.device, title, content);

			var fromUserId = "user-" + config.rongcloud.ADMIN_ID;
			var toUserIds = ["user-" + msg.receiver];
			var objectName = config.rongcloud.SELF_DEFINED_MSGTYPE.RESPONSE;
			var pushData = {
				"code": msg.extra.code
			};

			notify_engine.message_system_publish(fromUserId, toUserIds, objectName, content, content, pushData);

		}else{
			console.log("No token");
		}

		
	});

	/* 友盟推送方案
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
	*/



};

/**
* 新粉丝
*/
exports.follow_friend = function () {
	console.log("Engine follow_friend");
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

// MQTT 版推送

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

