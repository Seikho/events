import client = require("./client");
import Promise = require("bluebird");
import log = require("designco-logger");
export = publish;

//TODO: Needs refactoring
function publish(event: Store.Event) {
	var redisClient = client();
	var channel = eventToChannel(event);
	var message = JSON.stringify(event.data);
	var store = eventToListName(event);
	var storableEvent = eventToStorable(event);

	var pubPromise = new Promise((resolve, reject) => {
		redisClient.on("connect", () => {
			
			var multi = redisClient.multi([
				["zadd", "events", Date.now(), JSON.stringify(storableEvent)],
				["publish", channel, message]
			]);

			multi.exec((err, replies) => {
				if (err) reject("Transaction failed: " + err);
				else resolve(Promise.resolve(JSON.stringify(replies)));
			});
		});

		redisClient.on("error", err => {
			reject("Failed to connect: " + err);
		});
	});
	return pubPromise;
}

function eventToStorable(event: Store.Event) {
	return {
		event: event.event,
		context: event.context,
		key: event.key,
		data: event.data
	}
}

function eventToListName(event: Store.Event) {
	return event.context + "/" + event.key;
}

function eventToChannel(event: Store.Event) {
	return [event.context, event.event, event.key].join("/");
}

function typeToString(eventType: Store.Operation) {
	switch (eventType) {
		case Store.Operation.Create:
			return "create";
		case Store.Operation.Read:
			return "read";
		case Store.Operation.Update:
			return "update";
		case Store.Operation.Delete:
			return "delete";
		case Store.Operation.Notification:
			return "notification";
	}
	throw "InvalidTypeException: Invalid EventType provided";
}