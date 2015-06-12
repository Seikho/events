var client = require("./client");
var Promise = require("bluebird");
//TODO: Needs refactoring
function publish(event) {
    var redisClient = client();
    var pubPromise = new Promise(function (resolve, reject) {
        redisClient.on("connect", function () {
            var channel = eventToChannel(event);
            var message = JSON.stringify(event.data);
            var store = eventToListName(event);
            var storableEvent = eventToStorable(event);
            var multi = redisClient.multi([
                ["zadd", "events", Date.now(), JSON.stringify(storableEvent)],
                ["publish", channel, message]
            ]);
            multi.exec(function (err, replies) {
                reject("Transaction failed: " + err);
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
        event: typeToString(event.event),
        context: contextToString(event.context),
        key: event.key,
        data: event.data
    };
}
function eventToListName(event) {
    var eventContext = contextToString(event.context);
    return eventContext + "/" + event.key;
}
function eventToChannel(event) {
    var eventContext = contextToString(event.context);
    var eventType = typeToString(event.event);
    return [eventContext, eventType, event.key].join("/");
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
function contextToString(eventContext) {
    switch (eventContext) {
        case 0 /* User */:
            return "users";
    }
    throw "InvalidContextException: Invalid EventContext provided";
}
module.exports = publish;
