/**
 *
 */


define(function(require, exports, module) {
    "use strict";
    var bind = require("lodash/function/bind");
    var socket = require("socketio");
    var RTCManager = require("rtc_manager");
    var webSocketConf = require("web_socket_configuration");
    var RTCSignalsManagerSocketIO = require("rtc_signals_manager_socketio");

    var Chat = function() {
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

    Chat.prototype.attachEvents = function() {
        var messagesList = document.getElementsByName("messagesList")[0];
        var message = document.getElementsByName("message")[0];
        var connectButton = document.getElementsByClassName("connect")[0];
        var sendButton = document.getElementsByClassName("send")[0];

        var doActionsAfterConnected = function(channel, target) {
            connectButton.disabled = true;
            sendButton.disabled = false;
            message.disabled = false;
            var targetFrom = target === "callee" ? "caller" : "callee";

            messagesList.value = "Connection established\n" + "You are " + target + "\n\n";

            sendButton.addEventListener("click", function() {
                channel.send(message.value);
                messagesList.value = messagesList.value + target + ": " + message.value + "\n";
                message.value = "";
            });

            channel.onmessage = function(message) {
                messagesList.value = messagesList.value + targetFrom + ": " + message.data + "\n";
            };

            channel.onclose = function() {
                message.disabled = true;
                sendButton.disabled = true;
                connectButton.disabled = false;
            };
        };

        this.io.on("connect", bind(function() {
            //Needs only for RTC callee
            this.RTCManager_.listen(function(channel) {
                doActionsAfterConnected(channel, "callee");
            });

            var connectToPeerButton = document.getElementsByClassName("connect")[0];
            connectToPeerButton.onclick = bind(function() {
                this.RTCManager_.createChannel(function(channel) {
                    doActionsAfterConnected(channel, "caller");
                });
            }, this);

        }, this));
    };

    module.exports = Chat;
});
