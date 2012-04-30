var Role = db.model("Role");
var logger = app.set("logger");
var solrDefaultClientFactory = require('../lib/solrClientFactory.js');
var util = require('util');

var autocompleteResultsNumber = app.set("web.autocomplete.resultsNumber");

/**
 * Search autocomplete request
 * @param app
 */
module.exports = function(app, seoFooterDataAppender) {

    app.get('/search', seoFooterDataAppender, function(req,res,next){

        if (!('q' in req.query) || req.query.q.length == 0) {
            logger.info("Empty query, sending redirect to home page");
            res.redirect("/", 301);
            return;
        }

        var solrClient = solrDefaultClientFactory.getClient();

        var query = util.format('q=%s', encodeURIComponent(req.query.q));


        solrClient.query(query, function(err, resposeString){
            if (err) {
                next(new Error(err));
                return;
            }
            var parsedJson = JSON.parse(resposeString);
            var roleIds = new Array();
            parsedJson.response.docs.forEach(function(doc){
                roleIds.push(doc.roleId);
            });

            Role.where('uid').
                in(roleIds).
                run(function(err,roles){
                    if (err) {
                        next(new Error(err));
                    }

                    res.render('search/results.ejs', {roles: sortRolesAsInSolr(roleIds,roles),
                                                      needsVirtualRole: ! hasRoleWithExactName(roles, req.query.q),
                                                      searchQuery : req.query.q,
                                                      secretKey: Role.getSecretKeyForName(req.query.q)});
                });
        });
    });
};

function sortRolesAsInSolr(solrRolesId,roles) {
    var sortedRoles = new Array();
    roles.forEach(function(role){
        var index = solrRolesId.indexOf(parseInt(role.uid));
        sortedRoles[index] = role;
    });
    return sortedRoles;
}


function hasRoleWithExactName(roles, roleName) {
    var hasFlag = false;

    //TODO: no need to pass all the role, when first match is found
    //BUT break or return don't solve the problem
    roles.forEach(function(role){
        if (roleName == role.name) {
            hasFlag = true;
        }
    });
    return hasFlag;
}