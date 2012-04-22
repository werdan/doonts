var http = require('http-get');

var client = {
    execute:function (videoId, next, callback) {
        var options = {url: 'http://gdata.youtube.com/' + '/feeds/api/videos/' + videoId + '?v=2&alt=jsonc'};

        http.get(options, function (err, result) {
            if (err) {
                next(new Error(err));
                return
            }
            callback(null, result.buffer);
        });
    }
}

module.exports = client;