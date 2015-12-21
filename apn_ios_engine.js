// IOS 推送
var apn = require('apn');
var options = {
	cert: './cert.pem',
	key : './key.pem',
	gateway: 'gateway.sandbox.push.apple.com', /* gateway address gateway.push.apple.com, port 2195*/
	port: 2195,    /* gateway port */
};
 
var apnConnection = new apn.Connection(options);

apnConnection.on("connected", function(){
	Console.log("Connected Successfully!");
});

apnConnection.on("timeout", function(){
	Console.log("Connected Timeout!");
});

apnConnection.on("error", function(error){
	Console.log("Connect Error!" + error);
});

module.exports._push_notification = function(token, alert, payload){
	var myDevice = new apn.Device(token);
	var note = new apn.Notification();

	note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
	note.badge = 1;
	note.sound = "ping.aiff";
	note.alert = alert;
	note.payload = payload;

	apnConnection.pushNotification(note, myDevice);
}
