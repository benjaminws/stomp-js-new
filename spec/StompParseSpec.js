var StompParse = require('../lib/stomp_parse').StompParse;

describe('When parsing a STOMP frame', function() {
  var stomp_parse;
  var data;

  beforeEach(function () {
    stomp_parse = new StompParse();
    var data_string = 'CONNECTED\nsession-id:test\n\n\0';
    var data_string_no_command = 'session-id:test\n\n\0';

    data = Buffer(data_string, encoding='utf8');
    data_no_command = Buffer(data_string_no_command, encoding='utf8');
  });

  it('should return a string when extracting a command', function() {
    var command = stomp_parse.extract_command(data);
    expect(command).toEqual('CONNECTED');
  });

  it('should return an object when extracting headers', function() {
    var headers = stomp_parse.extract_headers(data_no_command);
    expect(typeof(headers)).toBe('object');
  });

  it('should have length of the headers as a string', function() {
    var header_data = stomp_parse.extract_headers(data_no_command);
    var expected_header = 'session-id:test';
    expect(header_data.length).toEqual(expected_header.length);
  });

  it('should have a key in the header object', function() {
    var header_data = stomp_parse.extract_headers(data_no_command);
    expect('session-id' in header_data.headers).toBeTruthy();
  });

  it('should have a value in the header object', function() {
    var header_data = stomp_parse.extract_headers(data_no_command);
    expect(header_data.headers['session-id']).toEqual('test');
  });

});
