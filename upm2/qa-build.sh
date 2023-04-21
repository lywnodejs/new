#!/bin/bash

npm run i
npm run qa

ret=$?
if [ $ret -ne 0 ];then
    echo "===== npm build failure ====="
    exit $ret
else
    echo "===== npm build successfully! ====="
fi

rm -rf output
mkdir -p output/upm2-static
mv ./dist/* output/

mv output/*.js output/*.css output/upm2-static

rm -rf ~/nginx/html/upm/*
mv output/* ~/nginx/html/upm
