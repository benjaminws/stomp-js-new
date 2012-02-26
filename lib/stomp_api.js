var StompSocket = require('./stomp_socket').StompSocket;

function Stomp(args) {
  this.port = args.port || 61613;
  this.host = args.host || "127.0.0.1";
  this.debug = args.debug || false;
  this.login = args.login;
  this.passcode = args.passcode;
  this.ssl = args.ssl || false;
  this.ssl_validate = args.ssl_validate || false;
  this.ssl_options = args.ssl_options || {};
  this['client-id'] = args['client-id'];
  var socket_args = {
    port: this.port,
    host: this.host,
    ssl: this.ssl,
    ssl_validate: this.ssl_validate,
    ssl_options: this.ssl_options
  };
  this.stompSocket = new StompSocket(socket_args);
  this._setupSocketListeners();
};

Stomp.prototype = new process.EventEmitter();

Stomp.prototype.connect = function() {
  this.stompSocket.connect();
}

Stomp.prototype.disconnect = function() {
  this.stompSocket.disconnect();
}

Stomp.prototype._setupSocketListeners = function() {
  this.stompSocket.on('socket_connected', function() {
    console.log('stomp connected');
  });
  this.stompSocket.on('socket_disconnected', function() {
    console.log('disconnected');
  });
  this.stompSocket.on('socket_error', function(error) {
    console.log('err' + error);
  });
  this.stompSocket.on('frame_ready', function(frame) {
    console.log(frame);
  });
}

module.exports.Stomp = Stomp;
