var logger = app.set("logger");

/**
 * Error handling controller
 */

module.exports = function(app) {

    app.error(function(err, req, res, next){
        logger.error(err);
        res.render('error/500.ejs',{ status:500});
    });

    //ALWAYS THE LAST ACTION
    app.all(/.*/, function(req,res,next) {
        logger.error("Page not found: " + req.originalUrl);
        res.render('error/404.ejs',{ status:404});
    });
};