var logger = app.set("logger");
var solrDefaultClientFactory = require('../../lib/solrClientFactory.js');

module.exports = function (schema, solrClientFactory) {

    if (!solrClientFactory) {
        solrClientFactory = solrDefaultClientFactory;
    }
    var solrClient = solrClientFactory.getClient();

    function updateRole(role, done) {
        var aggregatedAdvices = new Array();

        if (!role) {
            return;
        }

        if (role.advices && role.advices.length > 0) {
            role.advices.forEach(function (advice) {
                aggregatedAdvices.push(advice.text);
            });
            solrClient.add({roleId:role.uid, name:role.name, advices:aggregatedAdvices.join(" ")}, function (err) {
                if (err) {
                    logger.error(err);
                }
            });

        }
    }
    //Using parallel middleware
    schema.pre('save', function (next) {
        this.getRole(function (role) {
           updateRole(role);
        });
        next();
    });
}