import client = require("./client");
import types = require("designco-store");
import AppEvent = types.AppEvent;
import EventType = types.EventType;
import EventContext = types.EventContext;

function fetch(eventContext: EventContext, pattern: string): any[] {
	var redisClient: any = client();
	redisClient.zscan(["events", 0, pattern], console.log);
	return null;
}