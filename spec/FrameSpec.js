var Frame = require('../lib/frame').Frame;

describe('A basic frame', function() {
  var frame;

  beforeEach(function () {
    frame = new Frame();
  });

  it('should be an object', function() {
    expect(typeof(frame)).toBe('object');
  });

  it('will have a command attribute', function() {
    expect(frame.command).toBeNull();
  });

  it('will have a headers attribute', function() {
    expect(frame.headers).toBeNull();
  });

  it('will have a body attribute', function() {
    expect(frame.body).toBeNull();
  });

});
