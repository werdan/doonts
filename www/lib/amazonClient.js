var OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper({
    awsId:     app.set("web.amazon.awsId"),
    awsSecret: app.set("web.amazon.awsSecret"),
    assocId:   app.set("web.amazon.assocId")
});

module.exports = opHelper;