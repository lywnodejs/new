#!/bin/bash

Date=$(date +%Y-%m-%d-%H-%M)

git pull

rm -rf ./.next

npm run build

file="ladder-dataSource-$Date.tar.gz"

# tar -czf ./$file\
#     server.js\
#     .next\
#     package.json\
#     package-lock.json\
#     utils\
#     public\
#     node_modules

tar --exclude='./.git' --exclude='./*.gz' -czf ./$file .
