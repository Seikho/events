var client = require("./client");
var Promise = require("bluebird");
function fetch(pattern, count) {
    var redisClient = client();
    var fetchPromise = new Promise(function (resolve, reject) {
        redisClient.zscan(["events", 0, pattern, count || 1], function (err, result) {
            if (err)
                reject("Failed to fetch: " + err);
            else
                resolve(Promise.resolve(result));
        });
    });
    return fetchPromise;
}
module.exports = fetch;
