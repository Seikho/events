import chai = require("chai");
import store = require("../src/index");
import log = require("ls-logger");

var expect = chai.expect;
store.setHost("192.168.59.103", 6379);

function msgRecv(channel) {
	log.info("Received message on '" + channel +"'");
}

describe("redis tests", () => {
	var client = store.client();
	it("will flush the database", done => {
		client.flushdb((err, msg) => {
			expect(msg).to.equal("OK");
			expect(err).to.not.exist;
			done();
		});
	});

	it("will subscribe to a pattern channel", done => {
		store.psub("users/create/*", msgRecv)
			.then(res => {
				expect(res).to.be.true;
				done();
			}).catch(done);
	});

	it("will subscribe to a non-pattern channel", done => {
		store.sub("users/create/c.winkler", msgRecv)
			.then(res => {
				expect(res).to.be.true;
				done();
			}).catch(done);
	});

	it("will publish a new user to the event log", done => {
		var event = {
			event: "create",
			context: "users",
			key: "c.winkler",
			data: {
				username: "c.winkler",
				email: "carl@longshot.io",
				enabled: 1,
				company: "longshot.io"
			}
		};
		store.pub(event).then(res => {
			expect(res).to.exist;
			done();
		}).catch(done);
	});
	
	it("will fetch the previous message", done => {
		store.fetch("users",null,"c.winkler")
		.then(result => {
			console.log(result);
			done();
		}).catch(done);
	});

});