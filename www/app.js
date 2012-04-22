/* Module dependencies. */

var express = require('express');
app = module.exports = express.createServer();

process.env.NODE_ENV="production";

require('./config/env.js')(app, express);
require('./config/orm.js')(app);

var fb = require("facebook-api");

require('./config/cron.js')(app, fb);

var securityManager = require("./lib/securityManager")(fb);
var amazonClient = require("./lib/amazonClient.js");
var youtubeClient = require("./lib/youtubeClient.js");

require('./controllers/role.js')(app,securityManager);
require('./controllers/advice.js')(app, amazonClient, youtubeClient);
require('./controllers/home.js')(app);
require('./controllers/search.js')(app);
require('./controllers/page.js')(app);
require('./controllers/myaccount.js')(app,securityManager);

//ALWAYS THE LAST CONTROLLER
require('./controllers/error.js')(app);

app.listen(3000);


