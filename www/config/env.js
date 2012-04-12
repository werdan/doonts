var MongoStore = require('connect-mongo');
var log4js = require('log4js');
var connect = require('connect');

module.exports = function(app, express){

    /**
	 * Configure logger
	 */
	var logger = log4js.getLogger();

	log4js.addAppender(log4js.fileAppender('doonts.log'), 'doonts.log');
    app.configure(function() {
        app.set("web.authInfoTTL",86400*1000*30); //TTL for personal infor on facebook milliseconds
        //Configuration
    	app.set('db.name', 'doonts');
        app.set('db.host', 'localhost');
    	app.set("web.unsecureUrl","http://doonts.com");
        app.set("web.facebook.client_id","159891950744662");
    	app.set("web.facebook.client_secret","6ddf951ee8a086d0c3bd30c520576a31");
        app.set("web.adviceInfoTTL",86400*1000*1); //Interval between unconditional update of advice info,
        app.set("web.facebook.likeUpdateJobInterval", 1); //in minutes
    	app.set("web.homepage.rolesOnFirstLoad", 10);

    	app.set("web.autocomplete.resultsNumber", 5); //Max number of results to return in search autocomplete

        app.set("web.amazon.awsId", 'AKIAJIPCNYWM3IOPRN6A');
        app.set("web.amazon.awsSecret", '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');
        app.set("web.amazon.assocId", 'doonts-20');


    	app.set("logger", log4js.getLogger());
        app.use(function(req,res,next){
            next();
        });
        app.use(express.logger());
        app.use(express.cookieParser());

    	//TODO move params to app.set
    	app.use(express.session({ secret: "doontsecret", key: "doofront", store: new MongoStore({ db: app.set('db.name') })}));
	    app.use(connect.query());
    });

    app.configure('development', function() {
    	app.set("web.unsecureUrl","http://doonts.lxc");
    	app.set("db.debug",true);
    	app.set('db.name', 'tests');
     });

    app.configure('production', function() {

    });
};