/**
 * Send and receive signals with socket.io.
 */

define(function(require, exports, module) {
    "use strict";

    /**
     * @param {Socket} socket
     * @constructor
     */
    var RTCSignalsManagerSocketIO = function(socket) {
        /**
         * @private
         */
        this.socket_ = socket;
    };

    /**
     * @param {string} name
     * @param {*} data
     */
    RTCSignalsManagerSocketIO.prototype.emit = function(name, data) {
        this.socket_.emit(name, data);
    };

    /**
     * @param {string} name
     * @param {Function} callback
     */
    RTCSignalsManagerSocketIO.prototype.on = function(name, callback) {
        this.socket_.on(name, callback);
    };

    /**
     * @param {string} name
     * @param {Function} callback
     */
    RTCSignalsManagerSocketIO.prototype.once = function(name, callback) {
        this.socket_.on(name, callback);
    };

    module.exports = RTCSignalsManagerSocketIO;
});
