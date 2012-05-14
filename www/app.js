/* Module dependencies. */

var express = require('express');

app = module.exports = express.createServer();

console.log(process.env.NODE_ENV);
if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV="development";
}

require('./config/env.js')(app, express);
require('./config/orm.js')(app);

var fb = require("facebook-api");

require('./config/cron.js')(app, fb);

var securityManager = require("./lib/securityManager")(fb);
var amazonClient = require("./lib/amazonClient.js");
var youtubeClient = require("./lib/youtubeClient.js");
var seoFooterDataAppender = require("./lib/seoFooterDataAppender.js");

require('./controllers/role.js')(app, securityManager, seoFooterDataAppender);
require('./controllers/advice.js')(app, securityManager, amazonClient, youtubeClient);
require('./controllers/home.js')(app, seoFooterDataAppender);
require('./controllers/search.js')(app, seoFooterDataAppender);
require('./controllers/page.js')(app);
require('./controllers/myaccount.js')(app,securityManager);

//ALWAYS THE LAST CONTROLLER
require('./controllers/error.js')(app);

require('./config/cluster.js')(app);



