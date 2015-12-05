var mqtt = require('mqtt');
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




