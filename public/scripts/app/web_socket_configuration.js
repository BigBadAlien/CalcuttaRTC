/**
 *
 */

define(function(require, exports) {
    "use strict";
    var once = require("lodash/function/once");

    exports.getURI = once(function() {
        var loc = window.location, newURI;
        if (loc.protocol === "https:") {
            newURI = "wss:";
        } else {
            newURI = "ws:";
        }
        newURI += "//" + loc.host;

        return newURI;
    });
});
