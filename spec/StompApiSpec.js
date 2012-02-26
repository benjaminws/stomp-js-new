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

    it('will call _setupSocketListeners()', function() {
      spyOn(stomp, '_setupSocketListeners');
      spyOn(stomp.stompSocket, 'connect');
      stomp.connect();
      expect(stomp._setupSocketListeners).toHaveBeenCalled();
    });

  });

  describe('When connecting', function() {

    it('will call _setupSocketListeners()', function() {
      spyOn(stomp, '_setupSocketListeners');
      spyOn(stomp.stompSocket, 'connect');
      stomp.connect();
      expect(stomp._setupSocketListeners).toHaveBeenCalled();
    });

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

});
