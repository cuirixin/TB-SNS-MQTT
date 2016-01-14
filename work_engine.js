var mqtt = require('mqtt');
var nodemailer = require('nodemailer');
var config = require('./config')
// 不需要离线消息，cleanSession设置为true
var mqtt_cli  = mqtt.connect(config.mqtt_url, {clean:true}); // test.mosquitto.org

/**
* 即时消息
*/
exports.user_im = function (uid, msg) {
	console.log("Engine user_im");
	var topic = "noti/"+uid;
	var message = {
		"code": global.Sys.cont.CODE_USER_IM, 
		"module": global.Sys.cont.MODULE_IM
	};
	exports._publish_mqtt(topic, message);
};

/**
* 申请好友
*/
exports.apply_for_friend = function (uid, msg) {
	console.log("Engine apply_for_friend");
	var topic = "noti/"+uid;
	var message = {
		"code": global.Sys.cont.CODE_ADD_FRIEND_REQUEST, 
		"module": global.Sys.cont.MODULE_FRIEND
	};
	exports._publish_mqtt(topic, message);
};

/**
* 发送找回密码邮件
*/
exports.send_forget_pwd_email = function (email, url) {
	console.log("Engine send_forget_pwd_email");
	html = "重新设置密码：<a href='"+url+"'>请点击这里设置</a>";
	exports._send_email(email, "Exblorer Reset Password", html);
};

// create reusable transporter object using the default SMTP transport 
var transporter = nodemailer.createTransport('smtps://no-reply@tubban.com:chino2014@smtp.exmail.qq.com');

exports._send_email = function(to, subject, html){
	var mailOptions = {
	    from: 'Exborer 👥 <no-reply@tubban.com>', // sender address 
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



/**
* 新回复
*/
exports.subject_response = function (uid, msg) {
	console.log("Engine subject_response");
	var topic = "noti/"+uid;
	var message = {
		"code": global.Sys.cont.CODE_NEW_SUBJECT_RESPONSE, 
		"module": global.Sys.cont.MODULE_RESPONSE
	}
	exports._publish_mqtt(topic, message);
};

/**
* 系统消息
*/
exports.system_msg = function (uid, msg) {
	console.log("Engine system_msg");
	var topic = "noti/"+uid;
	var message = {
		"code": global.Sys.cont.CODE_NEW_SUBJECT_RESPONSE, 
	}
	exports._publish_mqtt(topic, message);
};

/**
* 新粉丝
*/
exports.follow_friend = function () {
	console.log("Engine follow_friend");
};

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

exports._push_notification = function (msg) {
	console.log(msg);
};




