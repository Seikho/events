var client = require("./client");
var pub = require("./pub");
var psub = require("./patternSub");
var sub = require("./sub");
var cfg = require("designco-config");
function setHost(hostname, port) {
    cfg.config("host", hostname);
    if (!port)
        return;
    cfg.config("port", port);
}
module.exports = {
    client: client,
    pub: pub,
    sub: sub,
    psub: psub,
    setHost: setHost,
    fetch: function () { } // NOOP
};
