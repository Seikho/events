var client = require("./client");
var log = require("ls-logger");
function subscribe(channels, callback) {
    var redisClient = client();
    redisClient.on("psubscribe", function (channel, count) {
        log.debug("[SUB]' Subscribed to " + channel + "' (" + count + ")");
    });
    redisClient.on("pmessage", function (channel, message) {
        callback(channel, message);
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
            reject(err);
        });
    });
    return subPromise;
}
module.exports = subscribe;
