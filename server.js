/**
 * Server for serve static files and signaling.
 */

var normalize = require("path").normalize;

var publicFolder = new (require("node-static").Server)("./public", { cache: false });
var testFolder = new (require("node-static").Server)(normalize(__dirname), { cache: false });

var httpServer = require("http").createServer();

var socketIO = require("socket.io");

var createRTCSignalsTransmitter = require("./rtc_signals_transmitter.js");

httpServer.on("request", function(req, res) {

    req.resume();
    req.on("end", function() {
        console.log(req.url);
        if (req.url.indexOf("/test/") === 0) {
            testFolder.serve(req, res);
        } else {
            publicFolder.serve(req, res);
        }
    });
});

httpServer.listen(8080);

var io = createRTCSignalsTransmitter(
    socketIO(httpServer));
