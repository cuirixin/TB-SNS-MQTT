
var mqtt = require('mqtt');

var client  = mqtt.connect('test.mosquitto.org', {clientId:'564462a194068f6ed9769a77',clean:false}); // test.mosquitto.org

client.on('connect', function () {
  console.log("Connect Success.");
  client.subscribe('noti/+',{qos:1});
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic + ": " + message.toString());
  //client.end();
});

