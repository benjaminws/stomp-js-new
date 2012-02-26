var StompSocket = require('../lib/stomp_socket').StompSocket;
var net = require('net'),
    tls = require('tls');

describe('StompSocket', function() {
  var stompSocket;

  beforeEach(function() {
    args = {
      ssl: false,
      ssl_validate: false,
      ssl_options: {},
      host: '127.0.0.1',
      port: 61613
    };
    stompSocket = new StompSocket(args);
  });

  describe('When using it without ssl', function() {
    it('will have a port property', function() {
      expect(stompSocket.port).toEqual(61613);
    });

    it('will have an ssl property of false', function() {
      expect(stompSocket.ssl).toBe(false);
    });

    it('will have an ssl_validate property of false', function() {
      expect(stompSocket.ssl_validate).toBe(false);
    });

    it('will have ssl_options property that is empty', function() {
      expect(stompSocket.ssl_options).toEqual({});
    });

    it('will call connect on the socket, with host and port args', function() {
      spyOn(stompSocket.socket, 'connect');
      stompSocket.connect();
      expect(stompSocket.socket.connect).toHaveBeenCalledWith(stompSocket.host, stompSocket.port);
    });

    it('will call setupListeners', function() {
      spyOn(stompSocket.socket, 'connect');
      spyOn(stompSocket, '_setupListeners');
      stompSocket.connect();
      expect(stompSocket._setupListeners).toHaveBeenCalled();
    });

  });

  describe('When getting data from the socket', function() {
    var data;
    var data_string;

    beforeEach(function() {
      var body = 'test body';
      var content_length = body.length;
      data_string = 'CONNECTED\nsession-id:test\ncontent-length:' + content_length +'\n\n'+ body + '\0\n';
      data = Buffer(data_string, encoding='utf8');
    });
    it('will prepare data for parsing, and pass to the parser', function() {
      spyOn(stompSocket.stompParser, 'parse_frame');
      stompSocket.handleData(data);
      expect(stompSocket.stompParser.parse_frame).toHaveBeenCalled();
    });
    it('will emit a "message_ready" event', function() {
      spyOn(stompSocket, 'emit');
      stompSocket.handleData(data);
      expect(stompSocket.emit).toHaveBeenCalled()
    });

  });

  describe('When sending data to the socket', function() {
    it('will call socket.write()', function() {
      spyOn(stompSocket.socket, 'write');
      stompSocket.write('test');
      expect(stompSocket.socket.write).toHaveBeenCalledWith('test');
    });
  });

});
