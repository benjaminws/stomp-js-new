function Stomp(args) {
  this.port = args.port || 61613;
  this.host = args.host || "127.0.0.1";
  this.debug = args.debug || false;
  this.login = args.login;
  this.passcode = args.passcode;
  this.ssl = args.ssl || false;
  this.ssl_validate = args.ssl_validate || false;
  this.ssl_options = args.ssl_options || {};
  this['client-id'] = args['client-id'];
};

module.exports.Stomp = Stomp;
