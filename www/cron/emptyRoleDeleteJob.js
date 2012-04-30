var Role = db.model("Role");
var logger = app.set("logger");


function deleteEmptyRoles () {
    var self = this;
    //TODO: There is a potential problem here.
    //We should prevent running the second instance of job if first is still running
    logger.info("Started job for empty roles deleter");
    var expiredTimestamp = Date.now();
    Role.find({hasAdvices: false, timestampCreated: {$lte:  expiredTimestamp}, author: null}, function(err, roles){
        logger.info("Found " + roles.length + " empty roles to be deleted");
        roles.forEach( function (role) {
            logger.info("Removing empty role " + role.uid + " created at " + role.timestampCreated);
            role.remove();
        });
    });
};

var EmptyRoleDeleter = {
    run: deleteEmptyRoles
};

module.exports = EmptyRoleDeleter;

