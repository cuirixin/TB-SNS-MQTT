
var mqtt = require('mqtt');

var client  = mqtt.connect('mqtt://localhost:5112', {clientId:"test", clean:false}); // test.mosquitto.org

client.on('connect', function () {
  console.log("Connect Success.");
  client.subscribe('im/test',{qos:1});
});

client.on('reconnect', function(){
  console.log("Reconnect Success." + Date.now());
});


client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic + ": " + message.toString());
  //client.end();
});

