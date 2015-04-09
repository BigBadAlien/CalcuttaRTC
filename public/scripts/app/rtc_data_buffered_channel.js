/**
 * For dynamic inheriting from constructed RTCDataChannel.
 */

define(function(require, exports, module) {
    "use strict";

    /**
     * @constructor
     */
    var RTCBufferedChannel = function() {
        /**
         * @type {Array}
         * @private
         */
        this.buffer_ = [];

        /**
         * @type {number=}
         */
        this.timeoutId_ = null;

        this.sending_ = false;
    };

    /**
     * @param {DOMString|Blob|ArrayBuffer|ArrayBufferView} data
     */
    RTCBufferedChannel.prototype.send = function(data) {
        if(!this.sending_) {
            this.start();
        }

        this.buffer_.push(data);
    };

    RTCBufferedChannel.prototype.start = function() {
        this.sending_ = true;

        var that = this;

        function sending(data) {
            var sendingData = data || that.buffer_.shift();

            that.timeoutId_ = setTimeout(function() {
                if (sendingData === undefined) {
                    sending();
                    return;
                } else if (that.bufferedAmount <= 10*16384) {
                    //Use Object.observe instead of polling
                    that.super_.send(sendingData);

                    sending();
                    return;
                } else {
                    sending(sendingData);
                    return;
                }
            }, 0);
        }

        sending();
    };

    RTCBufferedChannel.prototype.pause = function() {
        //@TODO pause of polling/observe buffer
    };

    module.exports = RTCBufferedChannel;
});
