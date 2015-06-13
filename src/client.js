var redis = require("redis");
var cfg = require("ls-config");
require("redis-scanstreams")(redis);
function newClient() {
    var redisPort = cfg.config("port") || 6379;
    var redisHost = cfg.config("host") || "localhost";
    var client = redis.createClient(redisPort, redisHost);
    return client;
}
module.exports = newClient;
