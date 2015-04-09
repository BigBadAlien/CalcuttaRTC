/**
 * RTC connection configuration.
 */

define({
    configuration: {
        iceServers: [
            { url: "stun:23.21.150.121" },
            { url: "stun:stun.l.google.com:19302" },
            { url: "turn:numb.viagenie.ca", credential: "webrtcdemo", username: "louis%40mozilla.com" }
        ]
    },
    options: {
        optional: [
            //is required for Chrome and Firefox to interoperate
            { DtlsSrtpKeyAgreement: true },
            //is required if we want to make use of the DataChannels API on Firefox
            { RtpDataChannels: true }
        ]
    }
});
