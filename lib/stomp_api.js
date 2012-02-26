var StompSocket = require('./stomp_socket').StompSocket;
var Frame = require('./frame').Frame;

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

Stomp.prototype.stomp_connect = function(headers) {
  var frame = new Frame(),
      args = {},
      headers = headers || {};

  args['command'] = 'CONNECT';
  args['headers'] = headers;

  var frame_to_send = frame.build_frame(args);
  this.send_frame(frame_to_send);
}

Stomp.prototype.send_frame = function(frame) {
  this.stompSocket.write(frame.as_string());
}

Stomp.prototype._setupSocketListeners = function() {
  var self = this;
  this.stompSocket.on('socket_connected', function() {
    console.log('connected');
    self.stomp_connect();
  });
  this.stompSocket.on('socket_disconnected', function() {
    console.log('disconnected');
  });
  this.stompSocket.on('socket_error', function(error) {
    console.log('err' + error);
  });
  this.stompSocket.on('frame_ready', function(frame) {
    console.log('GOT FRAME: ');
    console.log(frame);
    self.handle_frame(frame);
  });
}

Stomp.prototype.handle_frame = function(frame) {
  var self = this;

  switch (frame.command) {
    case 'CONNECTED':
      console.log('Connected to STOMP');
      self.session = frame.headers['session'];
      self.emit('connected');
      break;
    default:
      console.log('Could not parse command: ' + frame.command);
  }
}
module.exports.Stomp = Stomp;
