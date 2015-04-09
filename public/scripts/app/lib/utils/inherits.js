/**
 * @author Alexandr Ishchenko
 */

define(function(require, exports, module) {
    "use strict";
    var create = require("lodash/object/create");

    module.exports = function(child, parent) {
        child.prototype = create(parent.prototype, {
            "super_": parent.prototype,
            "constructor": child
        });
    }
});
