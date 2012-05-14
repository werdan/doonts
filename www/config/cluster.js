var logger = app.set("logger");

module.exports = function(app) {
    var cluster = require('cluster');
    var numCPUs = require('os').cpus().length;

    if (cluster.isMaster) {
        for (var i = 0; i < numCPUs; i++) {
            var env = process.env;
            env.CRON = 0;
            if (i==0) {
                logger.debug("Setting first worker as cron worker");
                env.CRON=1;
            }
            var worker = cluster.fork(env);
            if (i==0) {
                worker.CRON = true;
            }
        }

        cluster.on('death', function(worker) {
            var newWorker = cluster.fork();
            logger.warn('Worker ' + worker.pid + ' died and it will be re-spawned');
            if (typeof worker.CRON !== 'undefined' && worker.CRON === true) {
                logger.warn('Worker ' + worker.pid + ' was cron worker - re-spawning it as cron-worker');
                newWorker.CRON = true;
            }
        });
    } else {
        app.listen(3000);
    }
}
