import client = require("./client");
import pub = require("./pub");
import psub = require("./patternSub");
import sub = require("./sub");
import cfg = require("ls-config");
import fetch = require("./fetch");

export = {
	client: client,
	pub: pub,
	sub: sub,
	psub: psub,
	setHost: setHost,
	fetch: fetch
};

var eventConfig = cfg.config("events") || "127.0.0.1:6379";
var split = eventConfig.split(":");
cfg.config("eventsHost", split[0]);
cfg.config("eventsPort", split[1]);

function setHost(hostname: string, port?: number) {
	cfg.config("eventsHost", hostname);
	if (!port) return;

	cfg.config("eventsPort", port);
}