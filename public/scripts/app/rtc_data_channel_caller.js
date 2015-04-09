/**
 * Caller functional for creating WebRTC stream-connection
 * and channel for data.
 */

define(function(require, exports, module) {
    "use strict";
    var RTCStreamCaller = require("rtc_stream_caller");
    var RTCDataChannel = require("rtc_data_channel");
    var bind = require("lodash/function/bind");
    var inherits = require("lib/utils/inherits");

    /**
     * @param {RTCSignalsManager} signalsManager
     * @param {Function=} opt_callback
     * @constructor
     */
    var RTCDataChannelCaller = function(signalsManager, opt_callback) {
        this.super_.constructor.call(this, opt_callback);
        this.stream = new RTCStreamCaller(signalsManager);

        /**
        * @type {RTCDataChannel}
        */
        var sendChannel = this.stream.getPeerConnection().createDataChannel("data");
        sendChannel.onmessage = bind(this.onMessage, this);
        sendChannel.onopen = bind(this.onOpenChannel, this);
        sendChannel.onclose = bind(this.onCloseChannel, this);



        this.stream.createOffer();
    };
    inherits(RTCDataChannelCaller, RTCDataChannel);

    /**
     * @param {MessageEvent} message
     */
    RTCDataChannelCaller.prototype.onMessage = function() {
        //@TODO queue of events by extending EventEmmitter
    };

    /**
     * @param {Event} event
     */
    RTCDataChannelCaller.prototype.onOpenChannel = function() {
        this.super_.onOpenChannel.apply(this, arguments);

        //@TODO queue of events by extending EventEmmitter
    };

    /**
     * @param {Event} event
     */
    RTCDataChannelCaller.prototype.onCloseChannel = function() {
        //@TODO queue of events by extending EventEmmitter
    };

    module.exports = RTCDataChannelCaller;
});
