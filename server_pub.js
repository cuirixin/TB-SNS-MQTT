var redis = require('redis');
var bunyan = require('bunyan');
var log = bunyan.createLogger({
	name: 'server_pub',
	streams: [
		{
		  level: 'info',
		  path: './logs/info.log'
		  //stream: process.stdout            // log INFO and above to stdout 
		},
		{
		  level: 'error',
		  path: './logs/error.log'  // log ERROR and above to a file 
		}
	]
});

var config = require('./config');
var engine = require('./work_engine');

var redis_cli = redis.createClient(config.redis_url);

// 推送相关
var queue = global.Sys.cont.QUEUE_INFO_ALERT;

redis_cli.subscribe(queue);

redis_cli.on("subscribe", function (channel) {
	log.info("Subscribe topic:" + channel);
});
 

redis_cli.on("message", function (channel, message) {

    //console.log("Channel message: " + channel);
    var msg = JSON.parse(message.toString());

	switch (msg.extra.code) {
		case global.Sys.cont.CODE_USER_IM:
			engine.user_im(msg.receiver, msg)
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


/*
if(msg.code == global.Sys.cont.NEW_USER_MESSAGE){

}
*/