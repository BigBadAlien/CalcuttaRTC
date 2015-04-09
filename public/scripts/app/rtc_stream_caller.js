/**
 * Caller functional for establishing WebRTC connection.
 */

define(function(require, exports, module) {
    "use strict";
    var RTCStream = require("rtc_stream");
    var bind = require("lodash/function/bind");
    var inherits = require("lib/utils/inherits");

    /**
     * @param {RTCSignalsManager} signalsManager
     * @constructor
     */
    var RTCStreamCaller = function(signalsManager) {
        this.super_.constructor.call(this);
        this.signalsManager = signalsManager;

        this.signalsManager.on("candidate_callee", bind(this.gotCandidate, this));
        this.pc.onicecandidate = bind(this.handleIceCandidate, this, "caller");
    };
    inherits(RTCStreamCaller, RTCStream);

    /**
     * @public
     */
    RTCStreamCaller.prototype.createOffer = function() {
        this.pc.createOffer(
            bind(this.offerReady, this),
            bind(this.offerError));
    };

    /**
     * @param {RTCSessionDescription} localDescription
     * @protected
     */
    RTCStreamCaller.prototype.offerReady = function(localDescription) {
        this.pc.setLocalDescription(localDescription);
        this.signalsManager.emit("offer", localDescription);
        this.signalsManager.once("answer", bind(this.gotAnswer, this));
    };

    /**
     * @param {DOMError} event
     * @protected
     */
    RTCStreamCaller.prototype.offerError = function(event) {
        console.error("Error: " + event.message);
    };

    /**
     * @param {Object} message
     * @protected
     */
    RTCStreamCaller.prototype.gotAnswer = function(message) {
        var dsp = new RTCSessionDescription(message);
        this.pc.setRemoteDescription(dsp);
    };

    module.exports = RTCStreamCaller;
});
