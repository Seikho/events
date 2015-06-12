var client = require("./client");
var Promise = require("bluebird");
//TODO: Needs refactoring
function publish(event) {
    var redisClient = client();
    var channel = eventToChannel(event);
    var message = JSON.stringify(event.data);
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
                else
                    resolve(Promise.resolve(JSON.stringify(replies)));
            });
        });
        redisClient.on("error", function (err) {
            reject("Failed to connect: " + err);
        });
    });
    return pubPromise;
}
function eventToStorable(event) {
    return {
        event: event.event,
        context: event.context,
        key: event.key,
        data: event.data
    };
}
function eventToListName(event) {
    return event.context + "/" + event.key;
}
function eventToChannel(event) {
    return [event.context, event.event, event.key].join("/");
}
function typeToString(eventType) {
    switch (eventType) {
        case 0 /* Create */:
            return "create";
        case 1 /* Read */:
            return "read";
        case 2 /* Update */:
            return "update";
        case 3 /* Delete */:
            return "delete";
        case 4 /* Notification */:
            return "notification";
    }
    throw "InvalidTypeException: Invalid EventType provided";
}
module.exports = publish;
