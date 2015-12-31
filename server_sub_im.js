vim /**
* 服务端向即时消息接收用户推送来消息提示
*/
var mqtt = require('mqtt');
var config = require('./config')
var bunyan = require('bunyan');
var log = bunyan.createLogger({
	name: 'server_pub',
	streams: [
		{
		  level: 'info',
		  //path: './logs/im_info.log'
		  stream: process.stdout     // log INFO and above to stdout 
		},
		{
		  level: 'error',
		  //path: './logs/im_error.log'  // log ERROR and above to a file 
		  stream: process.stdout
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
  var uid = topic.split("/")[1];
  log.info("Server publish : " + 'noti/'+uid);
  var message = {"code": global.Sys.cont.CODE_USER_IM, "module": global.Sys.cont.MODULE_IM};
  client.publish('noti/'+uid, JSON.stringify(message),{qos:0});
});

// Important!!! 防止异常中断
process.on('uncaughtException', function (err) {
  //打印出错误
  log.info(err);
  //打印出错误的调用栈方便调试
  log.info(err.stack);
});
