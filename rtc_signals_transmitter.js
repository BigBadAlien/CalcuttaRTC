/**
 * Transmit signal between WebRTC caller and callee.
 */

var sample = require('lodash.sample');
var keys = require('lodash.keys');
var without = require('lodash.without');

/**
 * @param {Object} connected
 * @param {string} id
 * @return {Socket|null}
 */
var getRandomSocketExceptId = function(connected, id) {
    var connectionsExceptId = without(keys(connected), id);

    if(connectionsExceptId.length < 1) {
        return null;
    }

    return connected[sample(connectionsExceptId)];
};

/**
 * @param {Namespace} namespace
 * @param {Socket} socket
 * @returns {Socket|boolean}
 */
var getOptimalPeer = function(namespace, socket) {
    return getRandomSocketExceptId(namespace.connected, socket.id)
};

/**
 * @param {Server} io
 */
var createRTCSignalsTransmitter = function(io) {
    var RTCSignals = io.of('/rtc_signals');

    RTCSignals.on('connection', function(socket) {
        var callee;

        socket.on('offer', function(data) {
            //@TODO use Object.watch instead of setInterval
            var intervalID = setInterval(function() {
                callee = getOptimalPeer(RTCSignals, socket);
                if (callee === null) {
                    return;
                } else {
                    clearInterval(intervalID);
                }

                console.log('Offer ', socket.id, ' to ', callee.id);

                callee.once('answer', function(data) {
                    console.log('Answer from callee');
                    socket.emit('answer', data);
                });

                callee.once('candidate_callee', function(data) {
                    console.log('candidate_callee', data);
                    socket.emit('candidate_callee', data);
                });

                callee.emit('offer', data);
            }, 50);
        });

        socket.on('candidate_caller', function(data) {
            //@TODO use Object.watch instead of setInterval
            var intervalID = setInterval(function() {
                callee = getOptimalPeer(RTCSignals, socket);
                if (callee === null) {
                    return;
                } else {
                    clearInterval(intervalID);
                    console.log('candidate_caller', data);
                    callee.emit('candidate_caller', data);
                }
            }, 50);
        });

        socket.on('disconnect', function(){
            console.log('disconnect');
        });
    });

    return io;
};

module.exports = createRTCSignalsTransmitter;
