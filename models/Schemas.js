var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//定义UserDeviceToken对象模型
exports.DeviceTokenSchema = new Schema({
    device : String,
    token : String,
    uid: String,
    last_refresh: String
});

