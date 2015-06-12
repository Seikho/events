var client = require("./client");
var Promise = require("bluebird");
function fetch(pattern, count) {
    var options = {
        pattern: pattern,
        count: count || 0
    };
    var redisClient = client();
    var fetchPromise = new Promise(function (resolve, reject) {
        redisClient.on("error", function (err) {
            reject("Failed to fetch (Client failure): " + err);
        });
        redisClient.on("ready", function () {
            redisClient.zscan("events", options, function (err, result) {
                if (err)
                    reject("Failed to fetch: " + err);
                else
                    resolve(Promise.resolve(result));
            });
        });
    });
    return fetchPromise;
}
module.exports = fetch;
