var cronJob = require('cron').CronJob;
cronJob('* * * * * *', function(){
    console.log('You will see this message every second');
});