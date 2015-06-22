import client = require("./client");
import Promise = require("bluebird");
var terminus = require("terminus");
export = fetch;

function fetch(context?: string, event?: string, key?: string): Promise<any> {
	context = context || "*";
	event = event || "*";
	key = key || "*";

	var options = {
		pattern: '*"channel":"' + [context, event, key].join("/") + '"*',
	};

	var redisClient: any = client();

	var fetchPromise = new Promise((resolve, reject) => {

		var resultPipe = (results: FetchResult[]) => {
			var parsedResults = parseFetchResults(results);
			return Promise.resolve(parsedResults);
		};

		redisClient.on("error", err => {
			reject("Failed to fetch (Client failure): " + err);
		});

		redisClient.on("ready", () => {
			redisClient.zscan("events", options, err => {
				if (err) reject("Failed to fetch: ")
			}).pipe(terminus.concat({ objectMode: true }, resultPipe));

		});
	});

	return fetchPromise;
}
/**
 * Convert the stored data to a POJO from a JSON string
 */
function parseFetchResults(fetchResults: FetchResult[]) {
	var parsedResults = fetchResults.map(result => {
		var parsedData = JSON.parse(result.key);
		return {
			key: parsedData,
			value: result.value
		};
	});
}

interface FetchResult {
	key: any;
	value: number;
}
