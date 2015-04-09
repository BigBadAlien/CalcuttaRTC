/**
 * Main functional for creating and listening connection.
 */

define(function(require, exports, module) {
    "use strict";
    var RtcDataChannelCaller = require("rtc_data_channel_caller");
    var RtcDataChannelCallee = require("rtc_data_channel_callee");
    var bind = require("lodash/function/bind");

    /**
     * @param {RTCSignalsManager} signalsManager
     * @constructor
     */
    var RTCManager = function(signalsManager) {
        this.signalsManager_ = signalsManager;
    };

    /**
     * Waiting any RTC offer.
     *
     * @param {Function} callback
     */
    RTCManager.prototype.listen = function(callback) {
        this.signalsManager_.on("offer", bind(this.gotRtcOffer_, this, callback));
    };

    /**
     * @param {Function} callback
     * @param {Object} message
     * @private
     */
    RTCManager.prototype.gotRtcOffer_ = function(callback, message) {
        console.log("Got RTC offer");

        new RtcDataChannelCallee(this.signalsManager_,
            new RTCSessionDescription(message),
            function(event) {
                callback(event);
            });
    };

    /**
     * @param {Function} callback
     * @return {RtcDataChannelCaller}
     */
    RTCManager.prototype.createChannel = function(callback) {
        return new RtcDataChannelCaller(this.signalsManager_, callback);
    };

    module.exports = RTCManager;
});
