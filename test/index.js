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
    it("will subscribe to a pattern", function (done) {
        store.psub("users/create/*", function () { })
            .then(function (res) {
            expect(res).to.be.true;
            done();
        }).catch();
    });
});
