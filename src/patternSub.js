var client = require("./client");
var log = require("designco-logger");
var Promise = require("bluebird");
//TODO: Needs refactoring
function patternSubscribe(channels, callback) {
    var redisClient = client();
    redisClient.on("psubscribe", function (channel, count) {
        log.debug("[PSUB] Subscribed to '" + channel + "' (" + count + ")");
    });
    redisClient.on("pmessage", function (channel, pattern, message) {
        callback(channel, pattern, message);
    });
    var subPromise = new Promise(function (resolve, reject) {
        redisClient.on("ready", function () {
            if (channels instanceof Array)
                channels.forEach(function (c) { return redisClient.psubscribe(c); });
            else
                redisClient.psubscribe(channels);
            resolve(Promise.resolve(true));
        });
        redisClient.on("error", function (err) {
            reject("[SUB] RedisClient error: " + err);
        });
    });
    return subPromise;
}
module.exports = patternSubscribe;
