var StompParse = require('./stomp_parse').StompParse;
var net = require('net'),
    tls = require('tls');

function StompSocket(args) {
  this.port = args.port;
  this.host = args.host;
  this.ssl = args.ssl;
  this.ssl_validate = args.ssl_validate;
  this.ssl_options = args.ssl_options;
  this.socket = new net.Socket();
  this.stompParser = new StompParse();
  this.bufferLocked = false;
  this.buffer = '';
};

StompSocket.prototype = new process.EventEmitter();

StompSocket.prototype.prepareDataForParsing = function(buffer) {
  if (this.bufferLocked) {
    process.nextTick(this.prepareDataForParsing.bind(this));
  }
  this.bufferLocked = true;

  var frames = this.buffer.split('\0');

  if (frames.length == 1) return;
  this.buffer = frames.pop();

  this.bufferLocked = false;

  for (var i = 0; i < frames.length; i++) {
    frames[i] = frames[i].replace(/^\n+/, '');
  }

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
  var self = this;
  this.socket.on('drain', function() {

  });

  this.socket.on('data', function(chunk) {
    self.handleData(chunk);
  });

  this.socket.on('error', function(error) {
    self.emit('socket_error', error);
  });

  this.socket.on('close', function(error) {
    self.emit('socket_disconnected', error);
  });

  this.socket.on('connect', function() {
    self.emit('socket_connected');
  });
};

StompSocket.prototype.connect = function() {
  this._setupListeners();
  this.socket.connect(this.port, this.host);
};

StompSocket.prototype.disconnect = function() {
  this.socket.destroy();
};

StompSocket.prototype.write = function(frame) {
  return this.socket.write(frame);
};

module.exports.StompSocket = StompSocket;
