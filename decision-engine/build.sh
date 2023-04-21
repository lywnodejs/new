#!/bin/bash

Date=$(date +%Y-%m-%d-%H-%M)

git pull

rm -rf ./.next

npm run build

file="decision-engine-$Date.tar.gz"

# tar -czf ~/Desktop/$file\
#     server.js\
#     .next\
#     package.json\
#     package-lock.json\
#     utils\
#     public\
#     node_modules

tar --exclude='./.git' --exclude='./*.gz' -czf ./$file .
