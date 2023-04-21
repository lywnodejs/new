###
 # @Date: 2020-07-24 16:21:21
 # @LastEditors: wangjinling
 # @LastEditTime: 2020-07-27 16:45:42
### 
# !/bin/bash

source ~/.bashrc

# BR="br01"
# CN="hna"
# US="us01-s"
# PRE="hnb-pre"
# USPRE="us01-pre-v"

action=$1
BASE_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
if [ $DIDIENV_ODIN_CLUSTER == 'hnc-pre-v' ]
then
    echo "预发环境"
    case $action in
        "start" )
            # 启动服务
            cp $BASE_DIR/server.pre.conf ../nginx/conf/conf.d/
            /home/xiaoju/nginx/sbin/nginx -s reload
            ;;
        "stop" )
            # 停止服务

            ;;
        * )
            echo "unknown command"
            exit 1
            ;;
    esac
elif [ $DIDIENV_ODIN_CLUSTER == 'hnc-sim01-v' ]
then
    echo "仿真环境"
    case $action in
        "start" )
            # 启动服务
            cp $BASE_DIR/server.sim.conf ../nginx/conf/conf.d/
            /home/xiaoju/nginx/sbin/nginx -s reload
            ;;
        "stop" )
            # 停止服务

            ;;
        * )
            echo "unknown command"
            exit 1
            ;;
    esac
else
    echo "线上环境"
fi
echo "app start"
