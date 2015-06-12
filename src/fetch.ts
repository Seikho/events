import client = require("./client");

function fetch(context: Store.Context, pattern: string): any[] {
	var redisClient: any = client();
	redisClient.zscan(["events", 0, pattern], console.log);
	return null;
}