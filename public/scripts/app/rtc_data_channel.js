/**
 *
 */

define(function(require, exports, module) {
    "use strict";
    var BufferedChannel = require("rtc_data_buffered_channel");
    var inheritFromConstructedObject = require("lib/utils/inherits_from_constructed_object");

    /**
     * @param {Function} opt_callback
     * @abstract
     * @constructor
     */
    var RTCDataChannel = function(opt_callback) {
        this.callback = opt_callback;
    };

    /**
     * @param {Event} event
     * @protected
     */
    RTCDataChannel.prototype.onOpenChannel = function(event) {
        if (this.callback instanceof Function) {
            var channel = event.target;
            var BufferedChannelInerited = inheritFromConstructedObject(BufferedChannel, channel);
            this.callback(new BufferedChannelInerited());
        }
    };

    module.exports = RTCDataChannel;
});
