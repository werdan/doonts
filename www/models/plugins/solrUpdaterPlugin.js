var logger = app.set("logger");
var solrDefaultClientFactory = require('../../lib/solrClientFactory.js');

module.exports = function (schema, solrClientFactory) {

    if (!solrClientFactory) {
        solrClientFactory = solrDefaultClientFactory;
    }
    var solrClient = solrClientFactory.getClient();

    function updateRole(role) {
        var aggregatedAdvices = new Array();

        if (!role) {
            return;
        }

        if (role.advices && role.advices.length > 0) {
            role.advices.forEach(function (advice) {
                aggregatedAdvices.push(advice.text);
            });
        }
        solrClient.add({roleId:role.uid, name:role.name, advices:aggregatedAdvices.join(" ")}, function (err) {
            if (err) {
                logger.error(err);
            }
        });
    }

    /**
     * TODO: Possibility for performance optimization.
     * We can first find all roles to remove, and then a) remove by id from Solr and use Role.remove(criteria) to remove all empty roles in one request
     * In this case, it is necessary to remove .pre('remove') from solrUpdatePlugin, as role.remove() call middleware, but Role.remove() - no
     */
    function removeRoleFromSolr(role) {
        if (!role) {
            return;
        }

        solrClient.delete({roleId:role.uid}, function (err) {
            if (err) {
                logger.error(err);
            }
        });
    }


    schema.pre('remove', function (next) {
        logger.info("Removing role from Solr index");
        this.getRole(function (role) {
            logger.info("Removing role from Solr index 2");
            removeRoleFromSolr(role);
        });
        next();
    });

    //Using parallel middleware
    schema.pre('save', function (next) {
        this.getRole(function (role) {
            updateRole(role);
        });
        next();
    });
}