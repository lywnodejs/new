FROM keymetrics/pm2:12-alpine

# 设置工作路径。所有的路径都会关联WORKDIR
WORKDIR /usr/src/app

#RUN npm install --global pm2

# 安装依赖
#COPY package*.json ./
#RUN npm install

# 拷贝源文件
COPY . .

# 构建应用
RUN npm run build
#RUN rm -rf node_modules

# 运行应用
CMD ["pm2-runtime", "start", "pm2.json"]
#CMD ["npm", "run", "dev"]
