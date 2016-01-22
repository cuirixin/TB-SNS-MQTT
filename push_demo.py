#!/usr/bin/env python2.7
#-*- coding:utf8 -*-
# author: victor
# Copyright 2013 Tubban
import binascii
import urllib2
import hashlib
import json
import logging
import os
import sys
import time
#from gcmclient import gcm
#from gcmclient.gcm import JSONMessage, GCMAuthenticationError, GCM

"""
（用户端）APP消息推送Worker -- 正在使用
"""

ROOT_PATH = os.path.dirname(__file__)

def push_Apple_msg(device_token, title, msg, num, extra={}):

    appkey = "56a0a4a0e0f55a3caf0029d3"
    app_master_secret = "lqumzi2v6j9go4y7b9icbwq4zlnoy99o"
    timestamp = int(time.time() * 1000 )
    method = 'POST'
    url = 'http://msg.umeng.com/api/send'
    params = {'appkey': appkey,
              'timestamp': str(timestamp),
              'device_tokens': device_token,
              'type': 'unicast',
              'production_mode': 'false',
              'payload': {

                "aps": {
                    "alert": msg,
                },
                "extra": extra,
                "title": title,
                'display_type': 'notification'
              }
    }
    post_body = json.dumps(params)
    print post_body
    sign = md5('%s%s%s%s' % (method,url,post_body,app_master_secret))
    try:
        r = urllib2.urlopen(url + '?sign='+sign, data=post_body)
        print r.read()
    except urllib2.HTTPError,e:
        print e.reason,e.read()
    except urllib2.URLError,e:
        print e.reason


def md5(s):
    m = hashlib.md5(s)
    return m.hexdigest()

push_Apple_msg("c4b3dc55255e79f3365bdcf515e769d9f3ba99fd1333778bb3ed32507cf7f63a", '小仔', '牛逼啊', 1, {})