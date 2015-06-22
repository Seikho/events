import client = require("./client");
import Promise = require("bluebird");
import log = require("ls-logger");
export = publish;

//TODO: Needs refactoring
function publish(event: Event) {
	var redisClient = client();
	var channel = eventToChannel(event);
	var message = dataToStorable(event);
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
				else {
					log.debug("[PUB] Published to '" + channel + " (" + replies + ")");
					resolve(Promise.resolve(JSON.stringify(replies)));
				}
			});
		});

		redisClient.on("error", err => {
			reject("Failed to connect: " + err);
		});
	});
	return pubPromise;
}

interface Event {
	event: string,
	context: string,
	key: number|string,
	data: any
}

function dataToStorable(event: Event) {
	event.data = {
		published: Date.now(),
		data: event.data
	};

	return JSON.stringify(event.data);
}

function eventToStorable(event: Event) {
	return {
		channel: eventToChannel(event),
		data: event.data
	}
}

function eventToListName(event: Event) {
	return event.context + "/" + event.key;
}

function eventToChannel(event: Event) {
	return [event.context, event.event, event.key].join("/");
}
