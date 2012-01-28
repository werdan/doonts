var MongoStore = require('connect-mongo');
var log4js = require('log4js'); 

module.exports = function(app, express){

	/**
	 * Configure logger
	 */
	var logger = log4js.getLogger();
	log4js.addAppender(log4js.fileAppender('doonts.log'), 'doonts.log');
	
	app.configure(function() {
		//Configuration
    	app.set('db.name', 'doonts');
    	app.set('db.host', 'localhost');
    	app.set("web.unsecureUrl","http://doonts.com");
    	app.set("web.facebook.client_id","159891950744662");
    	app.set("web.facebook.client_secret","6ddf951ee8a086d0c3bd30c520576a31");
    	
    	app.use(express.logger());
    	app.use(express.cookieParser());
    	//TODO move params to app.set
    	app.use(express.session({ secret: "doontsecret", key: "doofront", store: new MongoStore({ db: app.set('db.name') })}));
    	var connect = require('connect');
	    app.use(connect.query());
    });
    app.configure('development', function() {
    	app.set("logger", log4js.getLogger());

    	app.set("web.unsecureUrl","http://doonts.lxc");
    	app.set("db.debug",true);
    	app.set('db.name', 'doonts');

    	app.use(express.errorHandler({
	        dumpExceptions: true,
	        showStack: true
	    }));
	    

    });

    app.configure('production', function() {
    	app.use(express.errorHandler());
    	app.set("logger", log4js.getLogger());
    });
};