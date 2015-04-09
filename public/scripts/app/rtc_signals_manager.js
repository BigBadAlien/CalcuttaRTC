/**
 * Abstract functional for send and receive signals.
 */

define(function(require, exports, module) {
    "use strict";
    var AbstractMethodNotImplementedError = require("lib/errors/abstract_method_not_implemented_error");

    /*jshint unused:false*/

    /**
     * @constructor
     */
    var RTCSignalsManager = function() {};

    /**
     * @param {string} name
     * @param {*} data
     */
    RTCSignalsManager.prototype.emit = function(name, data) {
        throw new AbstractMethodNotImplementedError("RTCSignalsManager", "emit");
    };

    /**
     * @param {string} name
     * @param {Function} callback
     */
    RTCSignalsManager.prototype.on = function(name, callback) {
        throw new AbstractMethodNotImplementedError("RTCSignalsManager", "on");
    };

    /**
     * @param {string} name
     * @param {Function} callback
     */
    RTCSignalsManager.prototype.once = function(name, callback) {
        throw new AbstractMethodNotImplementedError("RTCSignalsManager", "once");
    };

    /*jshint unused:true*/

    module.exports = RTCSignalsManager;
});
