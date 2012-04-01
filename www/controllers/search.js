var Role = db.model("Role");
var logger = app.set("logger");

var autocompleteResultsNumber = app.set("web.autocomplete.resultsNumber");

/**
 * Search autocomplete request
 * @param app
 */
module.exports = function(app) {
	app.get('/search/autocomplete', function(req,res,next){
	    if (!('q' in req.query)) {
	        res.json([]); //Returning empty result;
	        return
	    }  
	    var regexp = new RegExp(req.query.q,"ig");
	    
	    Role.where('name')
	        .select('name')
	        .$regex(regexp)
	        .limit(autocompleteResultsNumber)
	        .run(function(err,roles) {
    	        if (err) {
    	            next(new Error(err));
    	            return
    	        }
    	        roles.forEach(function(role){
    	            role._id = undefined;
    	        });
    	        res.json(roles);
	    });
	});
};