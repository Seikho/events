import redis = require("redis");
import config = require("./config");
export = newClient;

function newClient(): redis.RedisClient {
	var redisPort = config["port"] || 6379;
	var redisHost = config["host"] || "localhost";
	
	var client = redis.createClient(redisPort, redisHost);
	return client;
}