/**
 * @author Alexandr Ishchenko
 */

define(function(require, exports, module) {
    "use strict";
    var extend = require("lodash/object/extend");

    /**
     * @param {Function} inheritingConstructor
     * @param {Object} constructedObject
     * @returns {Object}
     */
    module.exports = function(inheritingConstructor, constructedObject) {
        var ProtoObject = function() {};
        ProtoObject.prototype = constructedObject;

        var protoObject = new ProtoObject();
        extend(protoObject, inheritingConstructor.prototype);
        inheritingConstructor.prototype = protoObject;
        inheritingConstructor.prototype.super_ = constructedObject;

        return inheritingConstructor;
    };
});
