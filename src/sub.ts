import client = require("./client");
import log = require("designco-logger");
export = subscribe;

function subscribe(channels: string|string[], callback: (channel: string, message: string) => void) {
	var redisClient = client();

	redisClient.on("ready", () => {
		if (channels instanceof Array)
			channels.forEach(c => redisClient.psubscribe(c));
		else redisClient.psubscribe(channels);
	});

	redisClient.on("psubscribe", (channel, count) => {
		log.debug("Client successfully subscribed to '" + channel + "' (" + count + ")");
	});

	redisClient.on("pmessage", (channel, message) => {
		callback(channel, message);
	});

	redisClient.on("error", err => {
		log.error("[SUB] RedisClient error: " + err);
	});
}

