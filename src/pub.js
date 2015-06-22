var client = require("./client");
var Promise = require("bluebird");
var log = require("ls-logger");
function publish(event) {
    var redisClient = client();
    var channel = eventToChannel(event);
    var message = dataToStorable(event);
    var store = eventToListName(event);
    var storableEvent = eventToStorable(event);
    var pubPromise = new Promise(function (resolve, reject) {
        redisClient.on("connect", function () {
            var multi = redisClient.multi([
                ["zadd", "events", Date.now(), JSON.stringify(storableEvent)],
                ["publish", channel, message]
            ]);
            multi.exec(function (err, replies) {
                if (err)
                    reject("Transaction failed: " + err);
                else {
                    log.debug("[PUB] Published to '" + channel + " (" + replies + ")");
                    resolve(Promise.resolve(JSON.stringify(replies)));
                }
            });
        });
        redisClient.on("error", function (err) {
            reject("Failed to connect: " + err);
        });
    });
    return pubPromise;
}
function dataToStorable(event) {
    event.data = {
        published: Date.now(),
        data: event.data
    };
    return JSON.stringify(event.data);
}
function eventToStorable(event) {
    return {
        channel: eventToChannel(event),
        data: event.data
    };
}
function eventToListName(event) {
    return event.context + "/" + event.key;
}
function eventToChannel(event) {
    return [event.context, event.event, event.key].join("/");
}
module.exports = publish;
