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

		var resultPipe = (results: RawFetchResult[]) => {
			var parsedResults = parseFetchResults(results);
			resolve(<any>parsedResults);
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
function parseFetchResults(fetchResults: RawFetchResult[]) {
	var parsedResults = fetchResults.map(result => {
		var parsedData = JSON.parse(result.key);
		return {
			key: parsedData,
			value: result.value
		};
	});
	return parsedResults;
}

interface RawFetchResult {
	key: any;
	value: number;
}
