function Frame() {
  this.command = null;
  this.headers = null;
  this.body = null;
};

Frame.prototype.build_frame = function(frame_args, want_receipt) {
  if ('command' in frame_args) this.command = frame_args['command'];
  if ('headers' in frame_args) this.headers = frame_args['headers'];
  if ('body' in frame_args) this.body = frame_args['body'];

  if (want_receipt) {
    receipt_stamp = Math.floor(Math.random()*99999999999).toString();
    if ('session' in this.headers) {
      receipt_stamp += "-" + this.headers['session'];
    }
    this.headers['receipt'] = receipt_stamp;
  }
  return this;
};

Frame.prototype.as_string = function() {
  var frame = '',
      header_strings = [];

  frame += this.command + '\n';

  for (var header in this.headers) {
    header_strings.push(header + ':' + this.headers[header]);
  }

  frame += header_strings.join('\n') + '\n\n';

  if (this.body) {
    frame += this.body;
  }

  frame += '\x00';

  return frame;
};

module.exports.Frame = Frame;
