#!/bin/bash
#npm 默认版本'2.11.3'，nodejs-0.12.7,无需做任何设置
#如需使用版本 npm: '3.8.6' node: '5.12.0' ，在build.sh设置环境变量如下：
#export PATH=/home/xiaoju/node-v5.12.0-linux-x64/bin:$PATH
#export NODE_PATH=/home/xiaoju/node-v5.12.0-linux-x64:/home/xiaoju/node-v5.12.0-linux-x64/lib/node_modules
#node 6.10 请在build.sh 设置环境变量:
export NODE_PATH=/home/xiaoju/node-v8.9.1-linux-x64:/home/xiaoju/node-v8.9.1-linux-x64/lib/node_modules
export PATH=/home/xiaoju/node-v8.9.1-linux-x64/bin:$PATH

npm config set registry https://artifactory.intra.xiaojukeji.com/artifactory/api/npm/npm/

git pull

npm install #安装依赖
npm run build #编译项目命令
ret=$?

if [ $ret -ne 0 ];then
    echo "===== build failure ====="
    exit $ret
else
    echo -n "===== build successfully! ====="
fi

rm -rf output
mkdir output

cp control.sh output/  # 拷贝control.sh脚本 至output目录下
cp server.conf output/
mv dist/* output/  #拷贝dist目录下的所有文件至output目录下
