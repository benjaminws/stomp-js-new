var Stomp = require('../lib/stomp_api').Stomp;

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
    it('will call send_frame()', function() {
      spyOn(stomp, 'send_frame');
      stomp.stomp_connect();
      expect(stomp.send_frame).toHaveBeenCalled();
    });
  });
  describe('When handing a new connect frame', function() {
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
});
