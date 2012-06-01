//TODO use cache for it, not to fetch roles from DB each time

var Role = db.model('Role');
var logger = app.set('logger');

/**
 * Middleware library that adds seoRoles array for seo footer construction in template
 * @param req
 * @param res
 * @param next
 */
module.exports = function(req, res, next) {
    logger.debug("Filling seoRoles for footer");
    Role.findTop(10,function(err, seoRoles){
        if (err) {
            next(new Error(err));
            return;
        }
        var viewOptions = app.set('view options');
        viewOptions.seoRoles = seoRoles;
        app.set('view options', viewOptions);
        logger.debug("SEO roles filled");
        next();
    });
};
