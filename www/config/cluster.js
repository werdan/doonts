var logger = app.set("logger");

module.exports = function(app) {
    var cluster = require('cluster');
    var numCPUs = require('os').cpus().length;
    var workerList = new Array();
    var sigint = false;

    if (cluster.isMaster) {
        for (var i = 0; i < numCPUs; i++) {
            var env = process.env;
            env.CRON = 0;
            if (i==0) {
                logger.debug("Setting first worker as cron worker");
                env.CRON=1;
            }
            var worker = cluster.fork(env);
            workerList.push(worker);

            if (i==0) {
                worker.CRON = true;
            }
        }

        process.on('SIGUSR2',function(){
            logger.warn("Received SIGUSR2 from system");
            logger.warn("There are " + workerList.length + " workers running");
            workerList.forEach(function(worker){
                logger.warn("Sending STOP message to worker PID=" + worker.pid);
                worker.send({cmd: "stop"});
            });
        });

        process.on('SIGINT',function(){
            sigint = true;
            logger.warn("Received SIGINT from system");
            var runningWorkers = workerList;
            runningWorkers.forEach(function(worker){
                logger.warn("Sending STOP message to worker PID=" + worker.pid);
                worker.send({cmd: "stop"});
            });
            process.exit();
        });

        cluster.on('death', function(worker) {
            if (sigint) {
                logger.warn("SIGKILL received - not respawning workers");
                return;
            }
            var newWorker = cluster.fork();
            logger.warn('Worker ' + worker.pid + ' died and it will be re-spawned');
            if (typeof worker.CRON !== 'undefined' && worker.CRON === true) {
                logger.warn('Worker ' + worker.pid + ' was cron worker - re-spawning it as cron-worker');
                newWorker.CRON = true;
            }
            removeWorkerFromListByPID(worker.pid);
            workerList.push(newWorker);
        });
    } else {
        process.on('message', function(msg) {
            if (msg.cmd && msg.cmd == 'stop') {
                logger.warn("Received STOP signal from master");
                app.close();
                process.exit();
            }
        });
        app.listen(3000);
    }

    function removeWorkerFromListByPID(pid) {
        var counter = -1;
        workerList.forEach(function(worker){
            ++counter;
            if (worker.pid === pid) {
                workerList.splice(counter, 1);
            }
        });
    }

}

