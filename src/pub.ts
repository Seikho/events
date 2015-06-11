import client = require("./client");
import Promise = require("bluebird");
export = publish;

function publish(event: DesignCo.AppEvent) {
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
				global.log.error("Publish transaction failed: " + err);
				return;
			}
			global.log.info("[" + channel + "] Transaction successful: " + JSON.stringify(replies));
		});


	});

	redisClient.on("error", err => {
		global.log.error("[PUB] RedisClient Error: " + err);
	});
}

function eventToStorable(event: DesignCo.AppEvent) {
	return {
		event: typeToString(event.event),
		context: contextToString(event.context),
		key: event.key,
		data: event.data
	}
}

function eventToListName(event: DesignCo.AppEvent) {
	var eventContext = contextToString(event.context);
	return eventContext + "/" + event.key;
}

function eventToChannel(event: DesignCo.AppEvent) {
	var eventContext = contextToString(event.context);
	var eventType = typeToString(event.event);

	return [eventContext, eventType, event.key].join("/");
}

function typeToString(eventType: DesignCo.EventType) {
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

function contextToString(eventContext: DesignCo.EventContext) {
	switch (eventContext) {
		case DesignCo.EventContext.User:
			return "users";
	}
	throw "InvalidContextException: Invalid EventContext provided";
}