import redis = require("redis");
import cfg = require("ls-config");
require("redis-scanstreams")(redis);

export = newClient;

function newClient(): redis.RedisClient {
	var redisPort = cfg.config("eventsPort") || 6379;
	var redisHost = cfg.config("eventsHost") || "localhost";
	
	var client = redis.createClient(redisPort, redisHost);
	return client;
}