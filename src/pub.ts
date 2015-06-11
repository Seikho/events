import client = require("./client");
import Promise = require("bluebird");
import log = require("designco-logger");
export = publish;

function publish(event: Store.AppEvent) {
	var redisClient = client();

	redisClient.on("connect", () => {
		var channel = eventToChannel(event);
		var message = JSON.stringify(event.data);
		var store = eventToListName(event);
		var storableEvent = eventToStorable(event);

		var multi = redisClient.multi([
			["zadd", "events", Date.now(), JSON.stringify(storableEvent)],
			["publish", channel, message]
		]);
		
		multi.exec((err, replies) => {
			if (err) {
				log.error("Publish transaction failed: " + err);
				return;
			}
			log.info("[" + channel + "] Transaction successful: " + JSON.stringify(replies));
		});


	});

	redisClient.on("error", err => {
		log.error("[PUB] RedisClient Error: " + err);
	});
}

function eventToStorable(event: Store.AppEvent) {
	return {
		event: typeToString(event.event),
		context: contextToString(event.context),
		key: event.key,
		data: event.data
	}
}

function eventToListName(event: Store.AppEvent) {
	var eventContext = contextToString(event.context);
	return eventContext + "/" + event.key;
}

function eventToChannel(event: Store.AppEvent) {
	var eventContext = contextToString(event.context);
	var eventType = typeToString(event.event);

	return [eventContext, eventType, event.key].join("/");
}

function typeToString(eventType: Store.EventType) {
	switch (eventType) {
		case Store.EventType.Create:
			return "create";
		case Store.EventType.Read:
			return "read";
		case Store.EventType.Update:
			return "update";
		case Store.EventType.Delete:
			return "delete";
		case Store.EventType.Notification:
			return "notification";
	}
	throw "InvalidTypeException: Invalid EventType provided";
}

function contextToString(eventContext: Store.EventContext) {
	switch (eventContext) {
		case Store.EventContext.User:
			return "users";
	}
	throw "InvalidContextException: Invalid EventContext provided";
}