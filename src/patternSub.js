var client = require("./client");
var log = require("designco-logger");
function patternSubscribe(channels, callback) {
    var redisClient = client();
    redisClient.on("ready", function () {
        if (channels instanceof Array)
            channels.forEach(function (c) { return redisClient.psubscribe(c); });
        else
            redisClient.psubscribe(channels);
    });
    redisClient.on("psubscribe", function (channel, count) {
        log.debug("Client successfully subscribed to '" + channel + "' (" + count + ")");
    });
    redisClient.on("pmessage", function (channel, pattern, message) {
        callback(channel, pattern, message);
    });
    redisClient.on("error", function (err) {
        log.error("[SUB] RedisClient error: " + err);
    });
}
module.exports = patternSubscribe;
