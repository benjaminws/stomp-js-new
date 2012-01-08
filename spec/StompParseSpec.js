var StompParse = require('../lib/stomp_parse').StompParse;
var util = require('util');

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
    var data;

    beforeEach(function () {
      stomp_parse = new StompParse();
      body = 'test body';
      content_length = body.length;
      var data_string = util.format('CONNECTED\nsession-id:test\ncontent-length:%d\n\n%s\0', content_length, body);
      data = Buffer(data_string, encoding='utf8');
    });

    it('should get an object', function() {
      var full_frame = stomp_parse.parse_frame(data);
      expect(typeof(full_frame)).toBe('object');
    });

    it('should return null if argument is not defined', function() {
      var null_frame = stomp_parse.parse_frame();
      expect(null_frame).toBe(null);
    });

    it('should call StompParse.extract_command with a data buffer', function() {
      spyOn(stomp_parse, 'extract_command');
      var full_frame = stomp_parse.parse_frame(data);
      expect(stomp_parse.extract_command).toHaveBeenCalledWith(data);
    });

    it('should call StompParse.extract_headers with a data buffer', function() {
      spyOn(stomp_parse, 'extract_headers');
      var command = stomp_parse.extract_command(data);
      var new_data = data.slice(command.length + 1, data.length);
      var full_frame = stomp_parse.parse_frame(data);
      expect(stomp_parse.extract_headers).toHaveBeenCalledWith(new_data);
    });

    it('should return an object named Frame', function() {
      var full_frame = stomp_parse.parse_frame(data);
      expect(full_frame.constructor.name).toBe('Frame');
    });

    it('should have a body in the data', function() {
      var full_frame = stomp_parse.parse_frame(data);
      expect('body' in full_frame).toBeTruthy();
    });

    it('should have "bytes_message" header if "content-length" specified in the headers', function() {
      var full_frame = stomp_parse.parse_frame(data);
      expect('bytes_message' in full_frame.headers).toBeTruthy();
    });

  });

});
