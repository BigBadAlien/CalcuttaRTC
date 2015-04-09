/**
 * Callee functional for creating WebRTC stream-connection
 * and channel for data.
 */

define(function(require, exports, module) {
    "use strict";
    var RTCStreamCallee = require("rtc_stream_callee");
    var RTCDataChannel = require("rtc_data_channel");
    var bind = require("lodash/function/bind");
    var inherits = require("lib/utils/inherits");

    /**
     * @param {RTCSignalsManager} signalsManager
     * @param {RTCSessionDescription} offer
     * @param {Function} opt_callback
     * @constructor
     */
    var RTCDataChannelCallee = function(signalsManager, offer, opt_callback) {
        this.super_.constructor.call(this, opt_callback);
        this.stream = new RTCStreamCallee(signalsManager, offer);

        this.stream.getPeerConnection().ondatachannel = bind(function(event) {
            /**
             * @type {RTCDataChannel}
             */
            var sendChannel = event.channel;
            sendChannel.onmessage = bind(this.onMessage, this);
            sendChannel.onopen = bind(this.onOpenChannel, this);
            sendChannel.onclose = bind(this.onCloseChannel, this);
        }, this);
    };
    inherits(RTCDataChannelCallee, RTCDataChannel);

    /**
     * @param {MessageEvent} message
     */
    RTCDataChannelCallee.prototype.onMessage = function() {
        //@TODO queue of events by extending EventEmmitter
    };

    /**
     * @param {Event} event
     */
    RTCDataChannelCallee.prototype.onOpenChannel = function() {
        this.super_.onOpenChannel.apply(this, arguments);

        //@TODO queue of events by extending EventEmmitter
    };

    /**
     * @param {Event} event
     */
    RTCDataChannelCallee.prototype.onCloseChannel = function() {
        //@TODO queue of events by extending EventEmmitter
    };

    module.exports = RTCDataChannelCallee;
});
