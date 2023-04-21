#!/bin/bash

# npm run i
# npm run build $1

# ret=$?
# if [ $ret -ne 0 ];then
#     echo "===== npm build failure ====="
#     exit $ret
# else
#     echo "===== npm build successfully! ====="
# fi

rm -rf output
mkdir output
mv ./dist/* output/

cp -rp Dockerfile output/Dockerfile
cp -rp ./aegis-static-upm2.conf   output/aegis-static-upm2.conf
