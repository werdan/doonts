/* Module dependencies. */
var express = require('express');
app = module.exports = express.createServer();

process.env.NODE_ENV="development";

app.init();

require('./config/env.js')(app, express);
require('./config/orm.js')(app);

//Using stub for facebookAPI
var fb = require("./tests/stubs/facebook-api-stub");

require('./config/cron.js')(app, fb);

var securityManager = require("./lib/securityManager")(fb);

require('./controllers/role.js')(app,securityManager);
require('./controllers/advice.js')(app);
require('./controllers/home.js')(app);
require('./controllers/search.js')(app);
