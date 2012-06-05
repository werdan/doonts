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


        solrClient.query(query, function(err, responseString){
            if (err) {
                next(new Error(err));
                return;
            }
            var parsedJson = JSON.parse(responseString);
            var solrRoleIds = new Array();
            parsedJson.response.docs.forEach(function(doc){
                solrRoleIds.push(doc.roleId);
            });

            Role.where('uid').
                in(solrRoleIds).
                run(function(err,roles){
                    if (err) {
                        next(new Error(err));
                    }

                    res.render('search/results.ejs', {roles: sortRolesAsInSolr(solrRoleIds,roles),
                                                      needsVirtualRole: ! hasRoleWithExactName(roles, req.query.q),
                                                      searchQuery : req.query.q,
                                                      secretKey: Role.getSecretKeyForName(req.query.q)});
                });
        });
    });
};

/**
 * TODO
 * There is perf optimization potentially here. Currently it is passing twice two arrays.
 * It can be done in one pass
 */
function sortRolesAsInSolr(solrRolesId,roles) {
    var sortedRoles = new Array();

    solrRolesId.forEach(function(roleId){
        var role = getRoleByIdFromArray(roles, roleId);
        if (role != -1) {
            sortedRoles.push(role);
        }
    });
    return sortedRoles;
}

function getRoleByIdFromArray(roles,roleId){
    var result = -1;
    roles.forEach(function(role){
        if (parseInt(role.uid) === roleId) {
            result = role;
            return;
        }
    });
    return result;
}


function hasRoleWithExactName(roles, roleName) {
    var hasFlag = false;

    //TODO: no need to pass all the roles, when first match is found
    //BUT break or return don't solve the problem
    roles.forEach(function(role){
        if (roleName.toLowerCase() == role.name.toLowerCase()) {
            hasFlag = true;
        }
    });
    return hasFlag;
}