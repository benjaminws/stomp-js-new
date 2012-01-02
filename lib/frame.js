function Frame() {
  this.command = null;
  this.headers = null;
  this.body = null;
};

Frame.prototype.build_frame = function() {
  return this;
}

module.exports.Frame = Frame;
