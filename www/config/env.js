var MongoStore = require('connect-mongo');
var log4js = require('log4js');
var connect = require('connect');
var logger = log4js.getLogger();


module.exports = function(app, express){

    app.set('views', __dirname + '/../views');
    app.set('view options', {og: new Array()});

    app.configure(function() {
        //CRON JOBS
        app.set("cron.facebookLikeUpdateJobInterval", 1); //in minutes
        app.set("cron.emptyRoleDelete", 60); //in minutes

        //Number of roles to load on home page before "Load more is clicked"
        app.set("web.authInfoTTL",86400*1000*30); //TTL for personal infor on facebook milliseconds
        //Configuration
        app.set('db.host', '127.0.0.1');
        app.set("web.unsecureUrl","http://doonts.com");
        app.set("web.facebook.client_id","159891950744662");
        app.set("web.facebook.client_secret","6ddf951ee8a086d0c3bd30c520576a31");
        app.set("web.facebook.logo","/images/logofb_200.jpg");

        app.set("web.adviceInfoTTL",86400*1000*1); //Interval between unconditional update of advice info,
    	app.set("web.homepage.rolesOnFirstLoad", 5);

        //Max number of roles in footer seo block (TOP ROLES)
        app.set("web.homepage.seoRolesInFooter", 30);

    	app.set("web.autocomplete.resultsNumber", 5); //Max number of results to return in search autocomplete

        app.set("web.amazon.awsId", 'AKIAJIPCNYWM3IOPRN6A');
        app.set("web.amazon.awsSecret", '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');
        app.set("web.amazon.assocId", 'doonts-20');

        app.set("web.roleCreation.secretKeySalt", "TyhgjGyahagghG658");

        app.set("web.adviceMaxLength", 280);

        app.set("solr.host","127.0.0.1");
        app.set("solr.port",8080);

        app.use(function(req,res,next){
            next();
        });
        app.use(express.bodyParser());

        app.use(express.logger());

        app.use(express.cookieParser());
	app.use(connect.query());
    });

    app.configure('development', function() {
    	app.set("web.unsecureUrl","http://doonts.lxc");
    	app.set("db.debug",true);
    	app.set('db.name', 'tests');
	app.use(express.session({ secret: "doontsecret", key: "doofront", store: new MongoStore({ db: app.set('db.name') })}));
        
	log4js.addAppender(log4js.fileAppender('/tmp/doonts.log'), '/tmp/doonts.log');
        app.set("logger", log4js.getLogger());

    });

    app.configure('production', function() {
        app.set("web.unsecureUrl","http://doonts.com");
        app.set('db.name', 'doonts');
	app.use(express.session({ secret: "doontsecret", key: "doofront", store: new MongoStore({ db: app.set('db.name') })}));

        log4js.addAppender(log4js.fileAppender('/var/log/doonts.log'), '/var/log/doonts.log');
        app.set("logger", log4js.getLogger());

    });
};
