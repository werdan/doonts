var MongoStore = require('connect-mongo');

module.exports = function(app, express){

	app.configure(function() {
    	app.set('db.name', 'doonts');
    	app.set('db.host', 'localhost');
    	
    	app.use(express.logger());
    	app.use(express.cookieParser());
    	//TODO Use params
    	//TODO use host, not only db.name
    	app.use(express.session({ secret: "doontsecret", key: "doofront", store: new MongoStore({ db: app.set('db.name') })}));
    	var connect = require('connect');
	    app.use(connect.query());

    });
    app.configure('development', function() {
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
    });
};