var https = require('https');
var url = require("url");
var User = require("./models/user");


//var userService = require('./services/userService');

function authToFacebook(req, next) {
	//TODO: move client_id && secret to config file
	//TODO: handle incorrect query string, e.g. without ?code (empty req.query.code)
	//TODO: move server domain to config file
	var parsedUrl = url.parse("http://doonts.lxc" + req.url);
	var redirectUrl = parsedUrl.protocol + "//" + parsedUrl.hostname + parsedUrl.pathname;
	var options = {
	  hostname: 'graph.facebook.com',
	  path: '/oauth/access_token?' + 
	  		'client_id=' + '159891950744662' + 
	  		'&redirect_uri=' + redirectUrl + 
	        '&client_secret=' + '6ddf951ee8a086d0c3bd30c520576a31' + 
	        '&code=' + req.query.code };
	  https.get(options, function(res) {
		  res.on('data', function(d) {
			  var parsedToken = parseAuthResponse(d);
			  console.log("Access token parsed successfully");
			  getMeUserId(parsedToken[1], function(userId, access_token) {
				  User.findOne({id: userId}, function(err, user) {
					  console.log(user.id);
					  console.log(user.access_token);
					  if (! user ) {
						  var newUser = new User();
						  newUser.id = userId;
						  newUser.access_token = access_token;
						  newUser.save();
					  }
					  console.log("Find user callback");
				  });
			  });
		  });
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
	next();
}
exports.authToFacebook = authToFacebook;

/**
 * Parse oauth facebook response
 * @param str
 * @returns array("",access_token,expires)
 */
function parseAuthResponse(str) {
	str = str.toString();
	//Looking for strings like: 
	//access_token=AAACRa77tNFYBAF81ccox56udZBCZABC2jr0KqIHnvJmBKTw6GM26yEHhK56WFv92ikPh3Ffh51cqMpv4Cm7gm7jRgbg4wD43LcPZCxIGiQiTQNAYIRq&expires=5362
	re = /access_token=(\w+)&expires=(\d+)/i;
	found = str.match(re);
	if (found && found.length == 3) {
		return(found);
	} else {
		throw "Wrong string format: " + str;
	}
}
exports.parseAuthResponse = parseAuthResponse;


function getMeUserId(access_token, callback) {
    console.log("Parsing FB user data to get userId");
	var options = {
			  hostname: 'graph.facebook.com',
			  path: '/me?access_token=' + access_token
		};
	https.get(options, function(res) {
		res.on('data', function(d) {
		  console.log("Got FB userdata: " + d.toString());
		  fbUserData = JSON.parse(d.toString());
		  console.log("UserId is:" + fbUserData.id);
		  callback(fbUserData.id, access_token);
		});
	}).on('error', function(e) {
		  console.log("Got error: " + e.message);
		});
}

exports.getMeUserId = getMeUserId;

//TODO: Move to User model
function getAndSaveAuthInfo() {
		console.log("Access token parsed successfully");
		fbUserId = fb.getUserId(access_token);
		req.session.userId = fbUserId;
		console.log(fbUserId);
}