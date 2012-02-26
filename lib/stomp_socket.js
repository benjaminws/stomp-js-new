var StompParse = require('./stomp_parse').StompParse;
var net = require('net'),
    tls = require('tls');

function StompSocket(args) {
  this.port = args.port;
  this.host = args.port;
  this.ssl = args.ssl;
  this.ssl_validate = args.ssl_validate;
  this.ssl_options = args.ssl_options;
  this.socket = new net.Socket();
  this.stompParser = new StompParse();
};

StompSocket.prototype = new process.EventEmitter();

StompSocket.prototype.prepareDataForParsing = function(buffer) {
  var frames = buffer.split('\0\n');

  if (frames.length == 1) {
    frames = buffer.split('\0');
  }

  if (frames.length == 1) return;
  buffer = frames.pop();
  return frames;

}

StompSocket.prototype.handleData = function(chunk) {
  var buffer = '';
  buffer += chunk;
  var frames = this.prepareDataForParsing(buffer);

  var parsed_frame = null;
  var _frame = null;
  while (_frame = frames.shift()) {
    parsed_frame = this.stompParser.parse_frame(_frame);
    this.emit('frame_ready', parsed_frame);
  }
}

StompSocket.prototype._setupListeners = function() {

  this.socket.on('drain', function() {

  });

  this.socket.on('data', function(chunk) {
    this.handleData(chunk);
  });

  this.socket.on('error', function(error) {
    this.emit('socket_error', error);
  });

  this.socket.on('close', function(error) {
    this.emit('socket_disconnected', error);
  });

  this.socket.on('connect', function() {
    this.emit('socket_connected');
  });
};

StompSocket.prototype.connect = function() {
  this.socket.connect(this.port, this.host);
  this._setupListeners();
};

StompSocket.prototype.write = function(frame) {
  return this.socket.write(frame);
};

module.exports.StompSocket = StompSocket;
