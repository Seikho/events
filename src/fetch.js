var client = require("./client");
var Promise = require("bluebird");
var terminus = require("terminus");
function fetch(context, event, key) {
    context = context || "*";
    event = event || "*";
    key = key || "*";
    var options = {
        pattern: '*"channel":"' + [context, event, key].join("/") + '"*',
    };
    var redisClient = client();
    var fetchPromise = new Promise(function (resolve, reject) {
        var resultPipe = function (results) {
            var parsedResults = parseFetchResults(results);
            resolve(parsedResults);
        };
        redisClient.on("error", function (err) {
            reject("Failed to fetch (Client failure): " + err);
        });
        redisClient.on("ready", function () {
            redisClient.zscan("events", options, function (err) {
                if (err)
                    reject("Failed to fetch: ");
            }).pipe(terminus.concat({ objectMode: true }, resultPipe));
        });
    });
    return fetchPromise;
}
function parseFetchResults(fetchResults) {
    var parsedResults = fetchResults.map(function (result) {
        var parsedData = JSON.parse(result.key);
        return {
            key: parsedData,
            value: result.value
        };
    });
    return parsedResults;
}
module.exports = fetch;
