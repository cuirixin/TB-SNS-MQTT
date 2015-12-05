"""
离线消息，
"""

var mqtt = require('mqtt');
var config = require('./config')

// 不需要离线消息，cleanSession设置为true
var client  = mqtt.connect(config.mqtt_url, {clean:true}); // test.mosquitto.org

client.on('connect', function () {
  console.log("Connect Success.");
  client.subscribe('im/+',{qos:1});
});

client.on('message', function (topic, message) {
  // message is Buffer
  uid = topic.split("/")[1]
  console.log("Server publish : " + 'noti/'+uid + " - " + message.toString());
  client.publish('noti/'+uid, {"code": global.Sys.cont.NEW_USER_MESSAGE} ,{qos:0});
});

