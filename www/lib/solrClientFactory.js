var solr = require('solr-client');

var solrHost = app.set("solr.host");
var solrPort = app.set("solr.port");

var solrClientFactory = {

    getClient: function() {
        var client = solr.createClient(solrHost, solrPort);
        return client;
    }
};

module.exports = solrClientFactory;