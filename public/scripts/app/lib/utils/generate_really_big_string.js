/**
 * Worker generates really big string, more than 100 MB.
 * Data chunks by 16 KB (16384 Bytes) + salt(iteration number).
 * Content of string always the same.
 * Needs for testing of data transmitted.
 */

(function() {
    "use strict";

    var TRANSMITTED_BYTES_TRESHOLD = 100000000;
    var transmittedBytes = 0;
    var salt = 0;
    var intervalId;

    var chunk = "";
    var sample = "The upper windows of green home are filled with light and apples";

    for (var i = 0, j = 256; i < j; i++) {
        chunk += sample;
    }

    onmessage = function(message) {
        if ("next" === message.data) {
            if (transmittedBytes >= 100000000) {
                postMessage("end");
            } else {
                postMessage(salt + chunk);

                transmittedBytes += (chunk.length + salt.toString().length);
                salt++;
            }
        } else if ("check" === message.data.type) {
            setTimeout(function() {
                var checkNum = parseInt(message.data.data.substr(0, 10));
                if (checkNum !== salt) {
                    throw new Error("Corrupted data received: " + message.data.data.substr(0, 5) + " not equal " + salt);
                }

                transmittedBytes += (chunk.length + salt.toString().length);
                salt++;

                if (transmittedBytes >= TRANSMITTED_BYTES_TRESHOLD) {
                    postMessage("end");
                }
            }, 0);
        } else if ("params" === message.data) {
            postMessage({
                "TRANSMITTED_BYTES_TRESHOLD" : TRANSMITTED_BYTES_TRESHOLD,
                "chunkLength": chunk.length
            });
        } else if ("subscribeOnStatus" === message.data) {
            intervalId = setInterval(function() {
                postMessage(Math.floor((transmittedBytes/TRANSMITTED_BYTES_TRESHOLD) * 100));
            }, 300);
        }
    };
})();
