import redis = require("redis");
import cfg = require("designco-config");
export = newClient;

function newClient(): redis.RedisClient {
	var redisPort = cfg.config("port") || 6379;
	var redisHost = cfg.config("host") || "localhost";
	
	var client = redis.createClient(redisPort, redisHost);
	return client;
}