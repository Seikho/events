import client = require("./client");
import log = require("ls-logger");
import Promise = require("bluebird");
export = patternSubscribe;

//TODO: Needs refactoring
function patternSubscribe(channels: string|string[], callback: (channel: string, pattern: string, message: any) => void) {
	var redisClient = client();

	redisClient.on("psubscribe", subSuccess);

	redisClient.on("pmessage", (channel, pattern, message) => {
		callback(channel, pattern, JSON.parse(message));
	});

	var subPromise = new Promise((rs, rj) => subHandler(rs, rj, channels, redisClient));

	return subPromise;
}

function subSuccess(channel: string, count: number) {
	log.debug("[PSUB] Subscribed to '" + channel + "' (" + count + ")");
}

function subHandler(resolve, reject, channels: string|string[], redisClient) {
	redisClient.on("ready", () => {
		if (channels instanceof Array)
			channels.forEach(c => redisClient.psubscribe(c));
		else redisClient.psubscribe(channels);
		resolve(Promise.resolve(true));
	});

	redisClient.on("error", err => {
		reject("[SUB] RedisClient error: " + err);
	});
}
