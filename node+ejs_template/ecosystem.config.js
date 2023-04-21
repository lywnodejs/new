module.exports = {
  apps : [{
    name: 'web2pdf',
    script: './bin/www.js',
    cwd:"./",
    log_date_format:"YYYY-MM-DD HH:mm:ss",
    error_file:"./logs/error.log",//错误输出日志
    out_file:"./logs/out.log",  //日志
    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'one two',
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
    env: {
      NODE_ENV: 'production',
      PORT:"31001"
    },
    env_production: {
      NODE_ENV: 'production',
      PORT:"31001"
    }
  }],
};


//  pm2 start ecosystem.config.js --interpreter babel-node  // pm2 stop  //pm2 reload all
