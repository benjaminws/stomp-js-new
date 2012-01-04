function StompParse() { };

StompParse.prototype.extract_command = function(data) {
  var command,
      data_string = data.toString('utf8', start=0, end=data.length);
  command = data_string.split('\n');
  return command[0];
};

StompParse.prototype.extract_headers = function(data) {
  var command,
      the_headers = {},
      data_string = data.toString('utf8', start-0, end=data.length);

  headers_string = data_string.split('\n\n', 1);
  headers_split = headers_string[0].split('\n');

  for (var i = 0; i < headers_split.length; i++) {
        var one_header = headers_split[i].split(':');
        if (one_header.length > 1) {
            var header_key = one_header.shift();
            var header_val = one_header.join(':');
            the_headers[header_key] = header_val;
        }
        else {
            the_headers[one_header[0]] = one_header[1];
        }
  }

  var return_values = {
    length: headers_string[0].length,
    headers: the_headers
  }

  return return_values;

};

module.exports.StompParse = StompParse;
