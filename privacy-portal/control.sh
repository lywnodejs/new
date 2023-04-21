#!/bin/sh
#############################################
## main
## 以supervisord托管服务, control.sh脚本必须实现start方法
#############################################

case $1 in
    "start" )
        # 启动服务
        echo "start"
        ;;
    "stop" )
        # 停止服务
        echo "stop"
        ;;
    * )
        echo "unknown command"
        exit 1
        ;;
esac
