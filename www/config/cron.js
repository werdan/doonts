var cronJob = require('cron').CronJob;
var logger = app.set("logger");

module.exports = function(app, fbapi){

    var cronFlag = process.env.CRON;
    if (cronFlag != 1) {
        return;
    }

    var periodMins = app.set("cron.facebookLikeUpdateJobInterval");
    var facebookLikesUpdateJob = require("../cron/facebookLikesUpdateJob")(fbapi);
    var facebookUpdaterPattern = '0 */' + periodMins + ' * * * *';
    logger.info("Installing cron job: facebookLikesUpdater with pattern " + facebookUpdaterPattern);
    cronJob(facebookUpdaterPattern, function() {
            facebookLikesUpdateJob.run();
    });


    var periodMins = app.set("cron.emptyRoleDelete");
    var emptyRoleDeleteJob = require("../cron/emptyRoleDeleteJob");
    var emptyRoleDeletePattern = '0 */' + periodMins + ' * * * *';
    logger.info("Installing cron job: emptyRoleDelete job with pattern " + emptyRoleDeletePattern);
    cronJob(emptyRoleDeletePattern, function() {
        emptyRoleDeleteJob.run();
    });
};