var redis = require("redis");
var config = require("./config");
function newClient() {
    var redisPort = config["port"] || 6379;
    var redisHost = config["host"] || "localhost";
    var client = redis.createClient(redisPort, redisHost);
    return client;
}
module.exports = newClient;
