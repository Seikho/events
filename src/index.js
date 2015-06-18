var client = require("./client");
var pub = require("./pub");
var psub = require("./patternSub");
var sub = require("./sub");
var cfg = require("ls-config");
var fetch = require("./fetch");
var eventConfig = cfg.config("events") || "127.0.0.1:6379";
var split = eventConfig.split(":");
cfg.config("eventsHost", split[0]);
cfg.config("eventsPort", split[1]);
function setHost(hostname, port) {
    cfg.config("eventsHost", hostname);
    if (!port)
        return;
    cfg.config("eventsPort", port);
}
module.exports = {
    client: client,
    pub: pub,
    sub: sub,
    psub: psub,
    setHost: setHost,
    fetch: fetch
};
