import client = require("./client");
import pub = require("./pub");
import psub = require("./patternSub");
import sub = require("./sub");
import cfg = require("designco-config");
import fetch = require("./fetch");

export = {
	client: client,
	pub: pub,
	sub: sub,
	psub: psub,
	setHost: setHost,
	fetch: fetch
};

function setHost(hostname: string, port?: number) {
	cfg.config("host", hostname);
	if (!port) return;
	
	cfg.config("port", port);
}