import client = require("./client");
import log = require("designco-logger");
export = patternSubscribe;

function patternSubscribe(channels: string|string[], callback: (channel: string, pattern: string, message: string) => void) {
	var redisClient = client();

	redisClient.on("ready", () => {
		if (channels instanceof Array)
			channels.forEach(c => redisClient.psubscribe(c));
		else redisClient.psubscribe(channels);
	});

	redisClient.on("psubscribe", (channel, count) => {
		log.debug("Client successfully subscribed to '" + channel + "' (" + count + ")");
	});

	redisClient.on("pmessage", (channel, pattern, message) => {
		callback(channel, pattern, message);
	});

	redisClient.on("error", err => {
		log.error("[SUB] RedisClient error: " + err);
	});
}

