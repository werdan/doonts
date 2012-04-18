var solr = require('solr-client');

var solrHost = app.set('solr.host');
var solrPort = app.set('solr.port');

// Create a client
var client = solr.createClient(solrHost, solrPort);

function createUpdateRoleById(roleId) {
    var query =
        this.findOne({_id:roleId})
        .populate('advices')
        .run(function(err, role){
            if (err) {
                logger.error(err);
                return
            }

    });
}

function createUpdateRole(role) {

    var agregatedAdvices = "";
    if (role.advices.length > 0) {
        role.advices.forEach(function(advice){
            agregatedAdvices = + advice.text;
        });
    }

    client.add({ roleId : role.uid, name : role.name, advices: agregatedAdvices },function(err){
        if(err){
            console.log(err);
        }else{
            client.commit(function(err,json){
                if(err){
                    console.log(err);
                }
            });
        }
    });
}
