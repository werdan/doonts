var logger = app.set("logger");

 function doRequest(method, url, callback) {
    var result = "";
    logger.debug("Preparing stub http response for url = " + url);
	if (url.indexOf("/oauth/access_token") != -1) {
    	result = "access_token=AAACRa77tNFYBAMgS8vEBZBDAB1301jbsFIZAg5W5c2SaWzBmxE5HJvwqPfu7CEBp3RzvTmUFddTUInzZA5YslenFERdQJLzpHDyCCnUclLVbOeJOlRY&expires=3742";
    } else if (url.indexOf("/me?access_token") != -1) {
    	result = '{"id":"100002043624653","name":"Andriy Samilyak","first_name":"Andriy","last_name":"Samilyak","link":"http://www.facebook.com/people/Andriy-Samilyak/100002043624653","gender":"male","locale":"uk_UA"}';
    //cronjobs.spec.js
    	console.log()
    } else if (url.indexOf("fql?q=SELECT%20total_count%20FROM%20link_stat%20WHERE%20url%3D%22http%3A%2F%2Fdoonts.lxc%2Frole%2Fview%2F144%2Fproject-manager-with-spaces%23130%22") != -1) {
        result = "{\"data\": [{\"total_count\": 17804}]}";
    //cronjobs.spec.js
    } else if (url.indexOf("fql?q=SELECT%20total_count%20FROM%20link_stat%20WHERE%20url%3D%22http%3A%2F%2Fdoonts.lxc%2Frole%2Fview%2F144%2Fproject-manager-with-spaces%23159%22") != -1) {
        result = "{\"data\": [{\"total_count\": 0}]}";
    }
    logger.debug("Stub response: " + result);
    callback(null, result);
};


var querystring = require('querystring');
var https = require('https');
var URL = require('url');

var raw = function(method, path, params, callback) {
    var facebook_graph_url = 'https://graph.facebook.com';
    path = path[0] == '/' ? path: '/' + path;
    var url = joinUrl(facebook_graph_url + path, params);
    var parser = JSON.parse;
    // oauth/access_token's data is not in json
    if (path == "/oauth/access_token") {
        parser = querystring.parse;
    }
    function cb(er, data) {
        if(er) {
            callback(er, null);
        } else {
            parsed = parser(data);
            callback(er, parsed);
        }
    }
    doRequest(method, url, cb);
};


function joinUrl(path, params) {
    return path + "?" + querystring.stringify(params);
}

function user(appid, appsecret) {
    return;
}

function testusers(appid, appsecret) {
    return;
}

if (typeof module == "object" && typeof require == "function") {
    exports.raw = raw;
    exports.user = require('../../node_modules/facebook-api/lib/user.js')(raw);
    exports.testusers = require('../../node_modules/facebook-api/lib/testusers.js')(raw);
}
