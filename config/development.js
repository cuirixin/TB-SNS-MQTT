
module.exports = {
    mqtt_url: "mqtt://115.28.235.98",
    redis_url: 'redis://root:UYdjD93@127.0.0.1:6379',
    mongodb_url : {
        main: 'mongodb://127.0.0.1:27017/tubban_sns',
        op: 'mongodb://127.0.0.1:27017/tubban_sns_op'
    },
    umeng : {
        production_mode : 'false',
        message : {
            ios : {
                AppKey : "56a0a4a0e0f55a3caf0029d3",
                AppMasterSecret : "lqumzi2v6j9go4y7b9icbwq4zlnoy99o",
            }
        }
    },
    rongcloud : {
        APP_KEY: "bmdehs6pdw0ys", 
        APP_SECRET: "Zi9cegxxo6oX5s",
        ADMIN_ID: "56a3323894068f3f4e8b3696",
        ADMIN_FRIEND_ID: "56a9c1a2c80e9610a088dae2",

        SELF_DEFINED_MSGTYPE : {
            FRIEND : 'RC:EBFriendMsg',
            RESPONSE : 'RC:EBResponseMsg'
        }
    }
}; 

global.Sys =new function(){
    this.cont={
        

        // 消息队列标识，与Python const中CODE对应
        QUEUE_INFO_ALERT : "info_alert",  // APP Notification
        QUEUE_EMAIL_PUSH : 'email_push',  // Email 推送

        // 业务码，与Python const中SUBCODE对应
        CODE_USER_IM : "user_im",                           // 即时通讯消息，如：新用户消息
        
        // QUEUE_INFO_ALERT
        CODE_ADD_FRIEND_REQUEST : 'add_friend_request',     // APP内消息推送，好友请求
        CODE_NEW_SUBJECT_RESPONSE : 'new_subject_response', // APP内消息推送，新回复消息
        CODE_NEW_FOLLOWED : 'new_followd',                   // APP内消息推送，新粉丝消息

        // QUEUE_EMAIL_PUSH
        CODE_FORGET_PASSWORD_EMAIL : 'forget_password_email', // 忘记密码邮件

        // Module
        MODULE_FRIEND : 'friend',                           // 好友模块
        MODULE_RESPONSE : 'response',                       // 回复模块
        MODULE_SYSTEM : 'system',                           // 系统模块
        MODULE_IM : 'im',                                   // 即时通讯模块

    }
};

