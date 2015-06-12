var client = require("./client");
function fetch(context, pattern) {
    var redisClient = client();
    redisClient.zscan(["events", 0, pattern], console.log);
    return null;
}
