/* Module dependencies. */
var express = require('express');
app = module.exports = express.createServer();

process.env.NODE_ENV="production";

require('./config/env.js')(app, express);
require('./config/orm.js')(app);

var fb = require("facebook-api");

require('./config/cron.js')(app, fb);

var securityManager = require("./lib/securityManager")(fb);

require('./controllers/role.js')(app,securityManager);
require('./controllers/advice.js')(app);
require('./controllers/home.js')(app);
require('./controllers/search.js')(app);
require('./controllers/myaccount.js')(app,securityManager);

app.listen(3000);


