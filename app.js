#!/usr/bin/env node

var argv = require('optimist').argv,
    dgram = require('dgram'),
    app = dgram.createSocket('udp4');

if (argv.server) {
    app.on('listening', function () {
        var address = app.address();
        console.log('UDP Server Listen on ' + address.address + ':' + address.port);
    });
    app.on('error', function (err) {
        console.log('Server: ', err);
    });
    app.on('message', function (message, remote) {
        console.log('From:' + remote.address + ':' + remote.port + ': ' + message);
    });
    app.bind(argv.server);
}
else if (argv.send) {
    var message = new Buffer(argv._.join(' '));
    var hostPort = argv.send.split(':');
    var host = hostPort[0];
    var port = hostPort[1];
    app.send(message, 0, message.length, port, host, function (err, byte) {
        if (err) {
            console.log('Client: ', err);
        } else {
            console.log('Message Sent');
            app.close();
        }
    });
} else {
    console.log('Incorrect Command');
    console.log('---- Start Server ----');
    console.log('udpchat --server PORT');
    console.log('---- Send Msg ----');
    console.log('udpchat --send ADDRESS:PORT Hello World');
}