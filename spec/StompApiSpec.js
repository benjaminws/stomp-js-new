var Stomp = require('../lib/stomp').Stomp;
var Frame = require('../lib/frame').Frame;

describe('StompApi', function() {
  var stomp;
  var args;

  beforeEach(function() {
    args = {
      port: 61613,
      host: '127.0.0.1',
      debug: true,
      login: 'guest',
      passcode: 'guest',
      ssl: true,
      ssl_validate: true
    }
    stomp = new Stomp(args);
  });

  describe('When instanciating it', function() {
    it('will have a port property', function() {
      expect(stomp.port).toEqual(61613);
    });

    it('will have a port property, even if args are not set', function() {
      delete args.port;
      stomp = new Stomp(args)
      expect(stomp.port).toEqual(61613);
      args.port = 61613;
      stomp = new Stomp(args)
    });

    it('will have a host property', function() {
      expect(stomp.host).toEqual('127.0.0.1');
    });

    it('will have a host attribute, even if args are not set', function() {
      delete args.host;
      stomp = new Stomp(args)
      expect(stomp.host).toEqual('127.0.0.1');
      args.host = '127.0.0.1';
      stomp = new Stomp(args)
    });

    it('will have a debug property', function() {
      expect(stomp.debug).toBe(true);
    });

    it('will have a debug property that is false if argument not defined', function() {
      delete args.debug;
      stomp = new Stomp(args);
      expect(stomp.debug).toBe(false);
      args.debug = true;
      stomp = new Stomp(args);
    });

    it('will have a login property if set', function() {
      expect(stomp.login).toEqual('guest');
    });

    it('will have a passcode property if set', function() {
      expect(stomp.passcode).toEqual('guest');
    });

    it('will have an ssl property if set', function() {
      expect(stomp.ssl).toBe(true);
    });

    it('will have and ssl property that is false if argument not defined', function() {
      delete args.ssl;
      stomp = new Stomp(args);
      expect(stomp.ssl).toBe(false);
      args.ssl = true;
      stomp = new Stomp(args);
    });

    it('will have an ssl_validate property if set', function() {
      expect(stomp.ssl_validate).toBe(true);
    });

    it('will have an ssl_validate property that is false if argument not defined', function() {
      delete args.ssl_validate;
      stomp = new Stomp(args);
      expect(stomp.ssl_validate).toBe(false);
      args.ssl_validate = true;
      stomp = new Stomp(args);
    });

    it('will have an ssl_options property as an empty object if not set', function() {
     expect(Object.keys(stomp.ssl_options).length === 0).toBeTruthy();
    });

    it('could have a client-id header', function() {
      args['client-id'] = 'test';
      stomp = new Stomp(args);
      expect(stomp['client-id']).toEqual('test');
    });

    it('will be an event emitter', function() {
      expect(stomp.constructor).toEqual(process.EventEmitter);
    });

  });

  describe('When connecting', function() {
    it('will call connect on the socket', function() {
      spyOn(stomp, '_setupSocketListeners');
      spyOn(stomp.stompSocket, 'connect');
      stomp.connect();
      expect(stomp.stompSocket.connect).toHaveBeenCalled();
    });
  });

  describe('When disconnecting', function() {
    it('will call disconnect on the socket', function() {
      spyOn(stomp.stompSocket, 'disconnect');
      stomp.disconnect();
      expect(stomp.stompSocket.disconnect).toHaveBeenCalled();
    });
  });

  describe('When using send_frame', function() {
    it('will call stompSocket.write', function() {
      spyOn(stomp.stompSocket, 'write');
      stomp.send_frame({as_string: function() {}});
      expect(stomp.stompSocket.write).toHaveBeenCalled();
    });
  });
  describe('When calling stomp connect', function() {
    it('will call send_command("CONNECT")', function() {
      spyOn(stomp, 'send_command');
      stomp.stomp_connect();
      expect(stomp.send_command).toHaveBeenCalledWith('CONNECT');
    });
  });
  describe('When handling a new connect frame', function() {
    var connected_frame;
    beforeEach(function() {
      connected_frame = {
        command: 'CONNECTED',
        headers: {
          'content-length': '0',
          session: 'd7afec48-b769-4a39-b985-890576a77d8a',
          bytes_message: true
        },
        body: 'content-length:0\nsession:d7afec48-b769-4a39-b985-890576a77d8a\n\n'
      }
    });
    it('will emit a "connected" event', function() {
      spyOn(stomp, 'emit');
      stomp.handle_frame(connected_frame);
      expect(stomp.emit).toHaveBeenCalledWith('connected');
    });
  });
  describe('When handling a new message frame', function() {
    var message_frame;
    beforeEach(function() {
      message_frame = {
        command: 'MESSAGE',
        headers: {
          receipt:'bah',
          destination:'/queue/test',
          'message-id':'Q_/queue/test@@session-Q3Rpkl3yJFRzZNwHNZFiVq@@1',
          'content-length':9
        },
        body:'HELLO'
      }
    });
    it('will emit a "message" event, with a message frame', function() {
      spyOn(stomp, 'emit');
      stomp.handle_frame(message_frame);
      expect(stomp.emit).toHaveBeenCalledWith('message', message_frame);
    });
  });
  describe('When handling a receipt frame', function() {
    var receipt_frame;
    beforeEach(function() {
      receipt_frame = {
        command: 'RECEIPT',
        headers: {
          'receipt-id':'bah',
        }
      }
    });
    it('will emit a "receipt" event, with the receipt-id', function() {
      spyOn(stomp, 'emit');
      stomp.handle_frame(receipt_frame);
      expect(stomp.emit).toHaveBeenCalledWith('receipt', 'bah');
    });
  });
  describe('When handling a new error frame', function() {
    var error_frame;
    beforeEach(function() {
      error_frame = {
        command: 'ERROR',
        headers: {
          message:'Bad CONNECT',
          'content-type':'text/plain',
          'content-length':23
        },
        body:'Authentication failure'
      }
    });
    it('will emit an "error" event, with an error frame', function() {
      spyOn(stomp, 'emit');
      stomp.handle_frame(error_frame);
      expect(stomp.emit).toHaveBeenCalledWith('error', error_frame);
    });
  });
  describe('When using send_command', function() {
    it('will request a built frame, and send it', function() {
      var command = 'CONNECT';
      var headers = {};
      var body = null;
      var args = {
        command: command,
        headers: headers,
        body: body
      };
      spyOn(stomp, 'send_frame');
      spyOn(stomp.frame_builder, 'build_frame');
      stomp.send_command(command, headers, body, false);
      expect(stomp.frame_builder.build_frame).toHaveBeenCalledWith(args, false);
      expect(stomp.send_frame).toHaveBeenCalled();
    });
  });
  describe('When subscribing to a destination', function() {
    it('will send a subscribe command', function() {
      var headers = {
        destination: '/queue/test',
        ack: 'client'
      }
      spyOn(stomp, 'send_command');
      stomp.subscribe(headers);
      headers['session'] = stomp.session;
      expect(stomp.send_command).toHaveBeenCalledWith('SUBSCRIBE', headers);
    });
  });
  describe('When unsubscribing from a destination', function() {
    it('will send an unsubscribe command', function() {
      var headers = {
        destination: '/queue/test',
      }
      spyOn(stomp, 'send_command');
      stomp.unsubscribe(headers);
      headers['session'] = stomp.session;
      expect(stomp.send_command).toHaveBeenCalledWith('UNSUBSCRIBE', headers)
    });
  });
  describe('When acking a message', function() {
    it('will send an ack command, with the message id', function() {
      var headers = {
        'message-id': 'Q_/queue/test@@session-wxdjhR0riWQOCFO0ztK1RA@@1'
      }
      spyOn(stomp, 'send_command');
      stomp.ack(headers['message-id']);
      expect(stomp.send_command).toHaveBeenCalledWith('ACK', headers)
    });
  });
  describe('When beginning a transaction', function() {
    it('will send a begin command with a transaction id, and return the transaction id', function() {
      spyOn(stomp, 'send_command');
      var transaction_id = stomp.begin();
      expect(stomp.send_command).toHaveBeenCalledWith('BEGIN', {'transaction': transaction_id});
    });
  });
  describe('When committing a transaction', function() {
    it('will send a commit command with a transaction id', function() {
      spyOn(stomp, 'send_command');
      var transaction_id = Math.floor(Math.random()*99999999999).toString();
      stomp.commit(transaction_id);
      expect(stomp.send_command).toHaveBeenCalledWith('COMMIT', {'transaction': transaction_id});
    });
  });
  describe('When aborting a transaction', function() {
    it('will send an abort command with a transaction id', function() {
      spyOn(stomp, 'send_command');
      var transaction_id = Math.floor(Math.random()*99999999999).toString();
      stomp.abort(transaction_id);
      expect(stomp.send_command).toHaveBeenCalledWith('ABORT', {'transaction': transaction_id});
    });
  });
  describe('When sending a message', function() {
    it('will send a message command with a body and headers object', function() {
      spyOn(stomp, 'send_command');
      var body = 'test'
      var headers = {
        destination: '/queue/test',
        persistent: true
      }
      stomp.send(body, headers);
      headers['session'] = stomp.session;
      expect(stomp.send_command).toHaveBeenCalledWith('SEND', headers, body, false);
    });
  });
});
