
var forget_pwd_email = ['<!DOCTYPE html>',
'<html >',
    '<head>',
        '<meta charset="utf-8">',
    '</head>',
    '<body style="margin: 100px 0 0 0; padding: 0px;">',
        '<div style="overflow: hidden; max-width: 1000px; margin: 0 auto 100px;">',
            '<div style="float:left; width: 15%; height: 300px; position: relative;" >',
            '</div>',
            '<div style="float:left; border-radius: 10px; position: relative; width: 70%;">',
                '<div style="background-color: #F5F5F5; min-height: 300px; border-radius: 10px; padding: 30px 50px; position: relative; z-index: 100;">',
                    '<div style="height: 20px; margin-bottom: 50px; overflow: hidden;">',
                        '<img src="http://static.exblorer.com/sns_mqtt/email/logo.png" style="height: 100%; float: right;"/>',
                    '</div>',
                    '<div style="font-size: 14px; color: #444;">',
                        '<p style="margin-bottom: 30px;">',
                            '{param0}:',
                        '</p>',
                        '<p style="text-align: left;">',
                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{param1}：<a href="{param2}">Link</a>',
                        '</p>',
                    '</div>',
                '</div>',
                '<div style="height: 15px; position: relative; top: -3px; z-index: 99;">',
                    '<img src="http://static.exblorer.com/sns_mqtt/email/email-shadow-bottom.png" style="height: 100%; width: 97%; margin-left: 2.5%;"/>',
                '</div>',
            '</div>',
            '<div style="float:left; width: 15%; height:130px; position: relative; margin-top: 10px;" >',
                '<img src="http://static.exblorer.com/sns_mqtt/email/email-shadow-right.png" style="height: 100%; width: 15px;"/>',
            '</div>',
        '</div>',
        '<div style="text-align: center; font-size: 13px; color: #999;">',
            '<p>',
                '&copy 2015-2016 Tubban Technologies | All Rights Reserved',
            '</p>',
        '</div>',
    '</body>',
'</html>'].join('');

exports.get_forget_pwd_email = function(lang, email, url){

    var param0 = "Hello, " + email;
    var param1 = "Reset password link is ";
    var param2 = url;
    switch (lang) {
        case 'zh-CN':
            param0 = email + ", 您好";
            param1 = "密码重置链接为";
            break;
        default:
            console.log("Unkown lang: " + lang);
    }

    return forget_pwd_email.replace("{param0}", param0).replace("{param1}", param1).replace("{param2}", param2)

}



