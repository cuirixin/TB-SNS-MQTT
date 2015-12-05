
var mqtt = require('mqtt');

var client = mqtt.connect('test.mosquitto.org'); // test.mosquitto.org  localhost:5112

var num = 1;
setInterval(function (){
  console.log("Publish : Hello mqtt " + num);
  client.publish('im/test', 'Hello mqtt ' + (num++),{qos:1, retain: true}, function(){
	// console.log("Publish : Hello mqtt " + num);
  });
}, 1000);
