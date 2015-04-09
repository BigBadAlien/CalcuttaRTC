/**
 * Error object for not implemented abstract method.
 */


define(function(require, exports, module) {
    var inherits = require("lib/utils/inherits");

    /**
     * @param {string} functionName
     * @param {string} constructorName
     * @constructor
     */
    AbstractMethodNotImplementedError = function(constructorName, methodName) {
        this.name = "AbstractMethodNotImplementedError";
        this.message = "Method " + constructorName + '#' + methodName + " must be implemented by subclass."
    };
    inherits(AbstractMethodNotImplementedError, Error);

    module.exports = AbstractMethodNotImplementedError;
});

