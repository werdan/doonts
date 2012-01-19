/* Module dependencies. */
var express = require('express');
app = module.exports = express.createServer();

process.env.NODE_ENV="production";

require('./config/env.js')(app, express);
require('./config/orm.js')(app);
require('./controllers/role.js')(app);

app.listen(3000);


