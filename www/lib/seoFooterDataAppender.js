//TODO use cache for it, not to fetch roles from DB each time

var Role = db.model('Role');

/**
 * Middleware library that adds seoRoles array for seo footer construction in template
 * @param req
 * @param res
 * @param next
 */
module.exports = function(req, res, next) {
    Role.findTop(10,function(err, seoRoles){
        if (err) {
            next(new Error(err));
            return;
        }
        app.set('view options', {seoRoles: seoRoles});
        next();
    });
};
