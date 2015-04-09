/**
 * Base functional for establish WebRTC connection.
 */

define(function(require, exports, module) {
    "use strict";
    var rtc = require("rtc");
    var defaults = require("lodash/object/defaults");
    var bind = require("lodash/function/bind");
    var rtcConfiguration = require("rtc_configuration");

    /**
     * @param {Object=} opt_conf
     * @abstract
     * @constructor
     */
    var RTCStream = function(opt_conf) {
        this.conf_ = defaults({}, opt_conf, rtcConfiguration);

        /**
         * @type {RTCPeerConnection}
         * @protected
         */
        this.pc = this.createPeerConnection(
            this.conf_.configuration,
            this.conf_.options
        );
    };

    /**
     * @returns {RTCPeerConnection}
     * @public
     */
    RTCStream.prototype.getPeerConnection = function() {
        return this.pc;
    };

    /**
     * @param {string} source name of source. Like "callee" or "caller".
     * @param {RTCPeerConnectionIceEvent} event
     * @protected
     */
    RTCStream.prototype.handleIceCandidate = function(source, event) {
        if (event.candidate) {
            this.signalsManager.emit("candidate_" + source, {
                type: "candidate",
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate });
        }
    };

    /**
     * @param {MediaStreamEvent} event
     * @protected
     */
    RTCStream.prototype.handleRemoteStreamAdded = function(event) {
        console.log("Remote stream added");
        console.log(event.stream);
    };

    /**
     * @param {MediaStreamEvent} event
     * @protected
     */
    RTCStream.prototype.handleRemoteStreamRemoved = function(event) {
        console.log("Remote stream removed. Event: ", event);
    };

    /**
     * @param {Object} message
     * @protected
     */
    RTCStream.prototype.gotCandidate = function(message) {
        var candidate = new RTCIceCandidate({sdpMLineIndex:message.label,
            candidate:message.candidate});

        this.pc.addIceCandidate(candidate);
    };

    /**
     * @returns {RTCPeerConnection}
     * @protected
     */
    RTCStream.prototype.createPeerConnection = function() {
        try {
            var pc = new rtc.RTCPeerConnection(null);

            pc.onicecandidate = bind(this.handleIceCandidate, this);
            pc.onaddstream = bind(this.handleRemoteStreamAdded, this);
            pc.onremovestream = bind(this.handleRemoteStreamRemoved, this);
            return pc;
        } catch (event) {
            console.error("Failed to create PeerConnection, exception: " + event.message);
            return null;
        }
    };

    module.exports = RTCStream;
});
