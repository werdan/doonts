var logger = app.set('logger');
var fs = require('fs');

module.exports = function(app, seoFooterDataAppender) {
    app.get('/page/:page', seoFooterDataAppender, function(req, res, next) {
        if ('page' in req.params) {
            var viewsDir = app.settings.views;
            var absoluteFileName = viewsDir + '/static/' + req.params.page + ".ejs";
            var fileName = 'static/' + req.params.page + ".ejs";
            logger.debug("Checking that file " + absoluteFileName + " exists");
            fs.lstat(absoluteFileName, function(err, stats) {
                if (!err) {
                    logger.debug("Rendering template " + fileName);
                    res.render(fileName);
                    return
                }
                //Will be trapped in error.js
                next();
            });
            return;
        }
        logger.error(req.originalUrl + " does not have correct params :page");
        //Will be trapped in error.js
        next();
    });
};