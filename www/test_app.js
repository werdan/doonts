/* Module dependencies. */
var express = require('express');
app = module.exports = express.createServer();

if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV="development";
}

app.init();

require('./config/env.js')(app, express);
require('./config/orm.js')(app);

require('./config/orm.js')(app);

//Using stub for facebookAPI
var fb = require("./tests/stubs/facebook-api-stub");

require('./config/cron.js')(app, fb);

var securityManager = require("./lib/securityManager")(fb);
var amazonClientStub = require("./tests/stubs/amazonClient-stub.js");
var youtubeClientStub = require("./tests/stubs/youtubeClient-stub.js");
var seoFooterDataAppender = require("./lib/seoFooterDataAppender.js");

require('./controllers/role.js')(app,securityManager, seoFooterDataAppender);
require('./controllers/advice.js')(app, securityManager, amazonClientStub, youtubeClientStub);
require('./controllers/home.js')(app, seoFooterDataAppender);
require('./controllers/search.js')(app, seoFooterDataAppender);
require('./controllers/page.js')(app, seoFooterDataAppender);
require('./controllers/myaccount.js')(app,securityManager);

//ALWAYS THE LAST CONTROLLER
require('./controllers/error.js')(app, seoFooterDataAppender);
