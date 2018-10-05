exports.fetchImpl = function(left, right, url, options, decoder) {
  return function(handler) {
    console.log("options: ", options)
    fetch(url, options).then(function(resp) {
      return resp.text();
    }).then(function(resp) {
      handler(decoder(right(resp)))();
    }).catch(function(err) {
      handler(decoder(left(String(err))))();
    });
  };
};
