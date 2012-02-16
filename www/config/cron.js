var cronJob = require('cron').CronJob;
var logger = app.set("logger");

module.exports = function(app, fbapi){
    
    var periodMins = app.set("web.facebook.likeUpdateJobInterval");
    var facebookLikesUpdater = require("../cron/facebookLikesUpdater")(fbapi);
    var facebookUpdaterPattern = '0 */' + periodMins + ' * * * *';
    logger.info("Installing cron job: facebookLikesUpdater with pattern " + facebookUpdaterPattern);
    cronJob(facebookUpdaterPattern, function() {
            facebookLikesUpdater.updateAdvices();
    });
};