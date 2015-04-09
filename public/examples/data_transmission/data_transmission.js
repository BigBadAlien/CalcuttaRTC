/**
 *
 */

window.onerror = function(message) {
    document.title = "error: " + event.message;
};

define(function(require, exports, module) {
    "use strict";
    var bind = require("lodash/function/bind");
    var socket = require("socketio");
    var RTCManager = require("rtc_manager");
    var webSocketConf = require("web_socket_configuration");
    var RTCSignalsManagerSocketIO = require("rtc_signals_manager_socketio");

    var DataTransmission = function() {
        /**
         * @type {Socket}
         */
        this.io = socket(webSocketConf.getURI() + "/rtc_signals");

        /**
         * @type {RTCManager}
         * @private
         */
        this.RTCManager_ = new RTCManager(new RTCSignalsManagerSocketIO(this.io));

        this.attachEvents();
    };

    DataTransmission.prototype.attachEvents = function() {
        var progress = document.getElementsByClassName("progress")[0];
        var TRANSMITTED_BYTES_TRESHOLD = 100000000;
        var bytes = 0;

        var attachProgressBarUpdating = function() {
            var intervalId = setInterval(function() {
                var width = Math.ceil((bytes / TRANSMITTED_BYTES_TRESHOLD) * 100);

                if (width >= 100) {
                    width = 100;
                    clearInterval(intervalId);
                    document.title = "done";
                }

                progress.style.width = width + "%";
            }, 50);
        };

        this.io.on("connect", bind(function() {
            //Needs only for RTC callee
            this.RTCManager_.listen(function(channel) {
                sendBigDataButton.disabled = true;

                /**
                 * Recreate file equal with file receiving from caller and compares it by chunks.
                 * Syntax of comparing:
                 *     worker.postMessage({
                 *         "type": "check",
                 *          "data": data
                 *     });
                 *
                 * @type {Worker}
                 */
                var bigStringChecker = new Worker("/scripts/app/lib/utils/generate_really_big_string.js");

                bigStringChecker.onerror = function(event) {
                    throw new Error(event.message);
                };

                attachProgressBarUpdating();

                channel.onmessage = function(message) {
                    bigStringChecker.postMessage({
                        "type": "check",
                        "data": message.data
                    });
                    bytes += message.data.length;
                };
            });

            var sendBigDataButton = document.getElementsByClassName("send_big_data")[0];

            sendBigDataButton.onclick = bind(function() {
                sendBigDataButton.disabled = true;
                this.RTCManager_.createChannel(function(channel) {
                    attachProgressBarUpdating();

                    /**
                     * Simulate file separated into chunks of 16 KB.
                     * After every "next" message to worker, onmessage function receives answer with one chunk.
                     * When chunks is over, "end" message receives.
                     *
                     * @type {Worker}
                     */
                    var bigStringGenerator = new Worker("/scripts/app/lib/utils/generate_really_big_string.js");

                    bigStringGenerator.onmessage = function(event) {
                        if("end" === event.data) {
                            return;
                        }

                        channel.send(event.data);
                        if ("number" === typeof event.data.length) {
                            bytes += event.data.length;
                        }

                        bigStringGenerator.postMessage("next");
                    };

                    bigStringGenerator.postMessage("next");
                });
            }, this);
        }, this));
    };

    module.exports = DataTransmission;
});
