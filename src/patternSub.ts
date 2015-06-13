import client = require("./client");
import log = require("ls-logger");
import Promise = require("bluebird");
export = patternSubscribe;

//TODO: Needs refactoring
function patternSubscribe(channels: string|string[], callback: (channel: string, pattern: string, message: string) => void) {
	var redisClient = client();

	redisClient.on("psubscribe", (channel, count) => {
		log.debug("[PSUB] Subscribed to '" + channel + "' (" + count + ")");
	});

	redisClient.on("pmessage", (channel, pattern, message) => {
		callback(channel, pattern, message);
	});

	var subPromise = new Promise((resolve, reject) => {
		redisClient.on("ready", () => {
			if (channels instanceof Array)
				channels.forEach(c => redisClient.psubscribe(c));
			else redisClient.psubscribe(channels);
			resolve(Promise.resolve(true));
		});

		redisClient.on("error", err => {
			reject("[SUB] RedisClient error: " + err);
		});
	});

	return subPromise;
}

