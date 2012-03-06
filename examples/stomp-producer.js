#!/usr/bin/env node

var Stomp = require('stomp').Stomp;

var num = process.argv[2];

// Set to true if you want a receipt
// of all messages sent.
var receipt = true;

// Set debug to true for more verbose output.
// login and passcode are optional (required by rabbitMQ)
var stomp_args = {
    port: 61613,
    host: 'localhost',
    debug: false,
    login: 'guest',
    passcode: 'guest',
}

var client = new Stomp(stomp_args);

var queue = '/queue/test_stomp';

client.connect();

client.on('connected', function() {
    num = num || 1000;
    for (var i = 0; i < num; i++) {
        var body = 'Testing\n\ntesting1\n\ntesting2 ' + i;
        client.send(body, {
            'destination': queue,
            'persistent': 'true'
        }, receipt);
    }
    console.log('Produced ' + num + ' messages');
});

client.on('receipt', function(receipt) {
    console.log("RECEIPT: " + receipt);
});

client.on('error', function(error_frame) {
    console.log(error_frame.body);
    client.disconnect();
});

process.on('SIGINT', function() {
    client.disconnect();
    process.exit(0);
});
