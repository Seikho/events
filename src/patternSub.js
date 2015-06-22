var client = require("./client");
var log = require("ls-logger");
var Promise = require("bluebird");
function patternSubscribe(channels, callback) {
    var redisClient = client();
    redisClient.on("psubscribe", subSuccess);
    redisClient.on("pmessage", callback);
    var subPromise = new Promise(function (rs, rj) { return subHandler(rs, rj, channels, redisClient); });
    return subPromise;
}
function subSuccess(channel, count) {
    log.debug("[PSUB] Subscribed to '" + channel + "' (" + count + ")");
}
function subHandler(resolve, reject, channels, redisClient) {
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
}
module.exports = patternSubscribe;
