/**
* 服务端向用户推送消息到达提示（非即时消息）
*/
var redis = require('redis');
var bunyan = require('bunyan');
var log = bunyan.createLogger({
	name: 'server_sub_email',
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

var redis_cli = redis.createClient(config.redis_url);

// 推送相关
var queue = global.Sys.cont.QUEUE_EMAIL_PUSH;

redis_cli.subscribe(queue);

redis_cli.on("subscribe", function (channel) {
	log.info("Subscribe topic:" + channel);
});

/*
var client2 = redis.createClient(config.redis_url);
client2.publish(queue, JSON.stringify({
	"extra": {
		"code" : global.Sys.cont.CODE_FORGET_PASSWORD_EMAIL,
		"email": "277831894@qq.com",
		"url" : "http://www.exblorer.com"
	}
}));
*/


redis_cli.on("message", function (channel, message) {

    //console.log("Channel message: " + channel);
    var msg = JSON.parse(message.toString());


    log.info("Language: "+msg.extra.lang);
	switch (msg.extra.code) {
		case global.Sys.cont.CODE_FORGET_PASSWORD_EMAIL:
			engine.send_forget_pwd_email(msg.extra.email, msg.extra.url, msg.extra.lang)
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