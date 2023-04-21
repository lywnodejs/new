#!/bin/bash

Date=$(date +%Y-%m-%d-%H-%M)

git pull

rm -rf ./.next

npm run build

file="h5-$Date.tar.gz"

tar --exclude='./.git' --exclude='./*.gz' -czf ./$file .
