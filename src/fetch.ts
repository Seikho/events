import client = require("./client");
import Promise = require("bluebird");
export = fetch;

function fetch(pattern: string, count?: number): Promise<any> {
	var options = {
		pattern: pattern,
		count: count || 0
	};

	var redisClient: any = client();

	var fetchPromise = new Promise((resolve, reject) => {
		redisClient.on("error", err => {
			reject("Failed to fetch (Client failure): " + err);
		});

		redisClient.on("ready", () => {
			redisClient.zscan("events", options, (err, result) => {
				if (err) reject("Failed to fetch: " + err);
				else resolve(Promise.resolve(result));
			});
		});
	});

	return fetchPromise;
}