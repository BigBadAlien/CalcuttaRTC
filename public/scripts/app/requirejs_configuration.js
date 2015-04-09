/**
 *
 */

(function(){
    "use strict";

    requirejs.config({
        baseUrl: "/scripts/app",
        paths: {
            vendor: "../vendor",
            rtc: "../vendor/webrtc-adapter/adapter",
            base: "../vendor/base",
            lodash : "../vendor/lodash",
            socketio: "../vendor/socket.io-client/socket.io"
        },
         shim: {
            rtc: {
                init: function() {
                    return {
                        "RTCPeerConnection": RTCPeerConnection,
                        "getUserMedia": getUserMedia,
                        "attachMediaStream": attachMediaStream,
                        "reattachMediaStream": reattachMediaStream,
                        "webrtcDetectedBrowser": webrtcDetectedBrowser,
                        "webrtcDetectedVersion": webrtcDetectedVersion
                    };
                }
            }
        }
    });
})();
