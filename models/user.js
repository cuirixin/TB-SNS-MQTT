var util = require('util');
var mongoose = require('mongoose');
var config = require("../config");

var Schemas = require("./Schemas");
var dburl = config.mongodb_url.main;
var db = mongoose.createConnection(dburl);

//访问User对象模型

var DeviceToken = db.model('DeviceToken', Schemas.DeviceTokenSchema, 'u_device_tokens');


exports.get_valid_token = function(uid, callback){

    var query = {
        uid: uid
    };

    var options = {
        sort : {'last_refresh': -1}
    }

    DeviceToken.findOne(query, {device: 1, token: 1, lang: 1, _id: 0}, options, function(err, entity){
        if (err) {
            console.log(err);
            callback(err, null);
        }

        //console.log(entity);

        if (entity){
            callback(null, entity);
        } else{
            callback(null, null);
        }
    });
};
