#!/bin/bash

Date=$(date +%Y-%m-%d-%H-%M)

git pull

rm -rf ./.next

npm run build

file="cloud-$Date.tar.gz"

tar --exclude='./.git' --exclude='./*.gz' -czf ./$file .
