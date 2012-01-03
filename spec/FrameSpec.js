var Frame = require('../lib/frame').Frame;

describe('A basic frame', function() {
  var frame;

  beforeEach(function() {
    frame = new Frame();
  });

  it('should be an object', function() {
    expect(typeof(frame)).toBe('object');
  });

  it('will have a command property', function() {
    expect(frame.command).toBeNull();
  });

  it('will have a headers property', function() {
    expect(frame.headers).toBeNull();
  });

  it('will have a body property', function() {
    expect(frame.body).toBeNull();
  });
});

describe('When building a frame', function() {
  var frame;

  beforeEach(function() {
    frame = new Frame();
  });

  it('will return an object', function() {
    var new_frame = frame.build_frame({});
    expect(typeof(new_frame)).toBe('object');
  });

  it('will take arguments as an object and fill command property', function() {
    var frame_args = {
      'command': 'test'
    };
    var new_frame = frame.build_frame(frame_args);
    expect(new_frame.command).toEqual('test');
  });

  it('will take arguments as an object and fill headers property, which is an object', function() {
    var frame_args = {
      'headers': {}
    };
    var new_frame = frame.build_frame(frame_args);
    expect(typeof(new_frame.command)).toBe('object');
  });

  it('will take arguments as an object and fill body property', function() {
    var frame_args = {
      'body': 'test'
    };
    var new_frame = frame.build_frame(frame_args);
    expect(new_frame.body).toEqual('test');
  });

  it('might take a "receipt" argument, and if it does, put it in the headers', function() {
    var receipt = true;
    var frame_args = {
      'body': 'test',
      'headers': {},
      'command': 'test'
    }
    var new_frame = frame.build_frame(frame_args, receipt);
    expect('receipt' in new_frame['headers']).toBeTruthy();
  });
});

describe('When asking for a receipt', function() {
  var frame;
  var receipt;
  var frame_args;

  beforeEach(function() {
    receipt = true;
    frame_args = {
      'body': 'test',
      'headers': {},
      'command': 'test'
    }
    frame = new Frame();
  });

  it('should make a receipt string of numbers', function() {
    var new_frame = frame.build_frame(frame_args, receipt);
    expect(new_frame['headers']['receipt']).toMatch(/^\d+$/);
  });

  it('should append session to receipt stamp if session is defined', function() {
    frame_args['headers']['session'] = 'test';
    var new_frame = frame.build_frame(frame_args, receipt);
    expect(new_frame['headers']['receipt']).toMatch(/^\d+\-test/);
  });

});
