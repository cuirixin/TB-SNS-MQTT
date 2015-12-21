var mosca = require('mosca')
var settings = {
  port: 5112,
  
  backend:{
  	  type: 'zmq',
      json: false,
      zmq: require("zmq"),  
      port: "tcp://127.0.0.1:33333",
      controlPort: "tcp://127.0.0.1:33334",
      delay: 5
  },
  /*
  backend:{
      type: 'mqtt',
      json: false,
      mqtt: require('mqtt'),
      url: 'mqtt://test.mosquitto.org'
  },
  */
  persistence:{
  	factory: mosca.persistence.Mongo,
    url: "mongodb://localhost:27017/mosca"
  }
};
var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

server.on('ready', function(){
	console.log('Mosca server is up and running');	
});

server.on('published', function(packet, client) {
  console.log('Published', packet.payload.toString());
});