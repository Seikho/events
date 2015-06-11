var client = require("./client");
function publish(event) {
    var redisClient = client();
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
            if (err) {
                global.log.error("Publish transaction failed: " + err);
                return;
            }
            global.log.info("[" + channel + "] Transaction successful: " + JSON.stringify(replies));
        });
    });
    redisClient.on("error", function (err) {
        global.log.error("[PUB] RedisClient Error: " + err);
    });
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
        case DesignCo.EventType.Create:
            return "create";
        case DesignCo.EventType.Read:
            return "read";
        case DesignCo.EventType.Update:
            return "update";
        case DesignCo.EventType.Delete:
            return "delete";
        case DesignCo.EventType.Notification:
            return "notification";
    }
    throw "InvalidTypeException: Invalid EventType provided";
}
function contextToString(eventContext) {
    switch (eventContext) {
        case DesignCo.EventContext.User:
            return "users";
    }
    throw "InvalidContextException: Invalid EventContext provided";
}
module.exports = publish;
