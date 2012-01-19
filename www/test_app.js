/* Module dependencies. */
var express = require('express');
app = module.exports = express.createServer();

process.env.NODE_ENV="development";

app.init();

require('./config/env.js')(app, express);
require('./config/orm.js')(app);
require('./controllers/role.js')(app);
