/**
* 服务端向用户推送消息到达提示
*/

var redis = require('redis');
var bunyan = require('bunyan');
var log = bunyan.createLogger({
	name: 'server_pub',
	streams: [
		{
			/*
			level: 'info',
			path: './logs/info.log',
			type: 'rotating-file',
			period: '1d',   // daily rotation 
			count: 30        // keep 30 back copies 
			*/
		    stream: process.stdout // 线上supervisor控制的log输出统一用stream: process.stdout
		},
		{
		  level: 'error',
		  //path: './logs/error.log'
		  stream: process.stderr
		}
	]
});

var config = require('./config');
var engine = require('./work_engine');

// 连接Redis
var redis_cli = redis.createClient(config.redis_url);

// 推送相关，订阅INFO_ALERT主题
var queue = global.Sys.cont.QUEUE_INFO_ALERT;

redis_cli.subscribe(queue);

redis_cli.on("subscribe", function (channel) {
	log.info("Subscribe topic:" + channel);
});
 

redis_cli.on("message", function (channel, message) {

    //console.log("Channel message: " + channel);

    // console.log(message);

    var msg = JSON.parse(message.toString());

	switch (msg.extra.code) {
		case global.Sys.cont.CODE_USER_IM:
			//engine.user_im(msg.receiver, msg)
			break;
		case global.Sys.cont.CODE_ADD_FRIEND_REQUEST:
			engine.apply_for_friend(msg.receiver, msg)
			break;		 
		case global.Sys.cont.CODE_NEW_SUBJECT_RESPONSE:
			engine.subject_response(msg.receiver, msg)
			break;	
		default:
			log.error("Unkown message code: " + msg.extra.code);
	}

});

// Important!!! 防止异常中断
process.on('uncaughtException', function (err) {
  //打印出错误
  log.info(err);
  //打印出错误的调用栈方便调试
  log.info(err.stack);
});

/*
if(msg.code == global.Sys.cont.NEW_USER_MESSAGE){

}
*/