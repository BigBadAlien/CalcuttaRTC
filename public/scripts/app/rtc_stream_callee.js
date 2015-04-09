/**
 * Callee functional for establishing WebRTC connection.
 */

define(function(require, exports, module) {
    "use strict";
    var RTCStream = require("rtc_stream");
    var bind = require("lodash/function/bind");
    var inherits = require("lib/utils/inherits");

    /**
     * @param {Socket} signalsManager
     * @param {RTCSessionDescription} offer
     * @constructor
     */
    var RTCStreamCallee = function(signalsManager, offer) {
        this.super_.constructor.call(this);

        this.signalsManager = signalsManager;

        this.signalsManager.on("candidate_caller", bind(this.gotCandidate, this));
        this.pc.onicecandidate = bind(this.handleIceCandidate, this, "callee");
        this.pc.setRemoteDescription(offer);

        this.pc.createAnswer(
            bind(this.answerReady, this),
            bind(this.answerError));
    };
    inherits(RTCStreamCallee, RTCStream);

    /**
     * @param {RTCSessionDescription} localDescription
     * @private
     */
    RTCStreamCallee.prototype.answerReady = function(localDescription) {
        this.pc.setLocalDescription(localDescription);
        this.signalsManager.emit("answer", localDescription);
    };

    /**
     * @param {DOMError} event
     * @protected
     */
    RTCStreamCallee.prototype.answerError = function(event) {
        console.error("Error: " + event.message);
    };

    module.exports = RTCStreamCallee;
});
