import chai = require("chai");
import store = require("../src/index");
import log = require("designco-logger");

var expect = chai.expect;
store.setHost("192.168.59.103", 6379);

describe("redis tests", () => {
	var client = store.client();
	it("will flush the database", done => {
		client.flushdb((err, msg) => {
			expect(msg).to.equal("OK");
			expect(err).to.not.exist;
			done();
		});
	});
});