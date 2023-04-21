var redisClient = {
  client:null,
  init(config){
    var redis = require('redis');
    redisClient.client = redis.createClient(config.port,config.host,{auth_pass:config.pws});
    redisClient.client.on('connect',function(){
      console.log('connect');
    });
  },
  getClient(){
    return redisClient.client;
  }
}
export default redisClient;