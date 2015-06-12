import client = require("./client");
import log = require("designco-logger");
export = subscribe;

//TODO: Needs refactoring
function subscribe(channels: string|string[], callback: (channel: string, message: string) => void) {
	var redisClient = client();

	redisClient.on("psubscribe", (channel, count) => {
		log.debug("Client successfully subscribed to '" + channel + "' (" + count + ")");
	});

	redisClient.on("pmessage", (channel, message) => {
		callback(channel, message);
	});

	var subPromise = new Promise((resolve, reject) => {
		redisClient.on("ready", () => {
			if (channels instanceof Array)
				channels.forEach(c => redisClient.psubscribe(c));
			else redisClient.psubscribe(channels);
			resolve(Promise.resolve(true));
		});

		redisClient.on("error", err => {
			reject(err);
		});
	});
	return subPromise;
}

