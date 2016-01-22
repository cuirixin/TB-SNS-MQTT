#!/bin/sh
cp -r `ls | grep -v build | xargs` ./build && cd ./build && rm -rf logs && rm -rf config && \cp -rf * ../../TB-SNS-MQTT/