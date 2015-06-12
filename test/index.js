var chai = require("chai");
var store = require("../src/index");
var expect = chai.expect;
store.setHost("192.168.59.103", 6379);
describe("redis tests", function () {
    var client = store.client();
    it("will flush the database", function (done) {
        client.flushdb(function (err, msg) {
            expect(msg).to.equal("OK");
            expect(err).to.not.exist;
            done();
        });
    });
    it("will subscribe to a pattern channel", function (done) {
        store.psub("users/create/*", function () { })
            .then(function (res) {
            expect(res).to.be.true;
            done();
        }).catch(done);
    });
    it("will subscribe to a non-pattern channel", function (done) {
        store.sub("users/create/c.winkler", function () { })
            .then(function (res) {
            expect(res).to.be.true;
            done();
        }).catch(done);
    });
    it("will publish a new user to the event log", function (done) {
        var event = {
            event: 0 /* Create */,
            context: 0 /* User */,
            key: "c.winkler",
            data: {
                username: "c.winkler",
                email: "carl@longshot.io",
                enabled: 1,
                company: "longshot.io"
            }
        };
        store.pub(event).then(function (res) {
            expect(res).to.exist;
            done();
        }).catch(done);
    });
    it("will fetch the previous message", function (done) {
        store.fetch("users/create/*", 1)
            .then(function (result) {
            console.log(result);
            done();
        }).catch(done);
    });
});
