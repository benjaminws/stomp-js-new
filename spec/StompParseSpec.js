var StompParse = require('../lib/stomp_parse').StompParse;

describe('When parsing a frame', function() {

  describe('It will need to parse a command from a buffer', function() {
    var stomp_parse;
    var data;

    beforeEach(function () {
      stomp_parse = new StompParse();
      var data_string = 'CONNECTED\nsession-id:test\n\n\0';
      data = Buffer(data_string, encoding='utf8');
    });

    it('should return a string when extracting a command', function() {
      var command = stomp_parse.extract_command(data);
      expect(command).toEqual('CONNECTED');
    });

    it('should return an object when extracting headers', function() {
      var headers = stomp_parse.extract_headers(data);
      expect(typeof(headers)).toBe('object');
    });
  });

  describe('It will need to parse the headers from the remainder of the buffer', function() {
    var stomp_parse;
    var data;

    beforeEach(function () {
      stomp_parse = new StompParse();
      var data_string = 'session-id:test\n\n\0';
      data = Buffer(data_string, encoding='utf8');
    });

    it('should have length of the headers as a string', function() {
      var header_data = stomp_parse.extract_headers(data);
      var expected_header = 'session-id:test';
      expect(header_data.length).toEqual(expected_header.length);
    });

    it('should have a key in the header object', function() {
      var header_data = stomp_parse.extract_headers(data);
      expect('session-id' in header_data.headers).toBeTruthy();
    });

    it('should have a value in the header object', function() {
      var header_data = stomp_parse.extract_headers(data);
      expect(header_data.headers['session-id']).toEqual('test');
    });
  });

  describe('It will need to parse and return a whole frame', function() {
    var stomp_parse;

    beforeEach(function () {
      stomp_parse = new StompParse();
      var data_string = 'CONNECTED\nsession-id:test\n\n\0';
      data = Buffer(data_string, encoding='utf8');
    });

    it('should get an object', function() {
      var full_frame = stomp_parse.parse_frame(data);
      expect(typeof(full_frame)).toBe('object');
    });

  });
});
