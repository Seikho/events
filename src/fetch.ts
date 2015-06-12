import client = require("./client");
import Promise = require("bluebird");
export = fetch;

function fetch(pattern: string, count?: number): Promise<any> {
	var redisClient: any = client();

	var fetchPromise = new Promise((resolve, reject) => {
		redisClient.zscan(["events", 0, pattern, count || 1], (err, result) => {
			if (err) reject("Failed to fetch: " + err);
			else resolve(Promise.resolve(result));
		});

	});

	return fetchPromise;
}