
var mqtt = require('mqtt');
var config = require('./config')
var bunyan = require('bunyan');
var log = bunyan.createLogger({
	name: 'server_pub',
	streams: [
		{
		  level: 'info',
		  path: './logs/im_info.log'
		  //stream: process.stdout            // log INFO and above to stdout 
		},
		{
		  level: 'error',
		  path: './logs/im_error.log'  // log ERROR and above to a file 
		}
	]
});

// 不需要离线消息，cleanSession设置为true
var client  = mqtt.connect(config.mqtt_url, {clean:true}); // test.mosquitto.org

client.on('connect', function () {
  log.info("Connect Success.");
  client.subscribe('im/+',{qos:1});
});

client.on('message', function (topic, message) {
  // message is Buffer
  uid = topic.split("/")[1]
  log.info("Server publish : " + 'noti/'+uid);
  client.publish('noti/'+uid, {"code": global.Sys.cont.CODE_USER_IM} ,{qos:0});
});

