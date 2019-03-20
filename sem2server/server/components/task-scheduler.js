var scheduler = require('node-cron');

module.exports = function (loopbackApp, options) {
    LOGGER.scheduledTask('Initialize Task Scheduler');

    //TASK RUNNER
    var runOneTimesTask = function (fileName, loopbackApp, params, id) {
        LOGGER.scheduledTask(`task ${fileName} started`);
        var task = require('../tasks/' + fileName);
        task(loopbackApp, params);

        //If it has Id then delete from DB
        if (id) {
            loopbackApp.models.scheduledTask.destroyById(id, function (err) {
                if (err) {
                    LOGGER.scheduledTask(`Cannot delete from DB the task has id ${id} \n ${err}`);
                } else {
                    LOGGER.scheduledTask(`Deleted from DB task has id ${id}`);
                }
            });
        }
    };

    //MAKE TASKSCHEDULER TO BE GLOBAL SO IT CAN BE CALLED EVERYWHERE INSIDE APPLICATION
    global.TASKSCHEDULER = {
        //Execute a task without inserting it into DB
        //fileName: Path to the code file that will be executed timely
        //params: An array contains parameters that will be passed to the code file
        executeTaskFromDB: function (timeOrCronExpression, repeat, fileName, params = null, id = null, immediateStart = true) {
            if (repeat) {
                scheduler.schedule(timeOrCronExpression, (() => runOneTimesTask(fileName, loopbackApp, params, id)), immediateStart);
            }
            else {
                var runDate = new Date(timeOrCronExpression);
                var now = (new Date()).getTime();
                setTimeout((() => runOneTimesTask(fileName, loopbackApp, params, id)), runDate - now);
            }
            LOGGER.scheduledTask(`${repeat ? 'Repeat' : 'Nonrepeat'} task ${fileName} has just scheduled at ${timeOrCronExpression}`);
        },
        //Execute task after n second delayed
        executeOneTimesTask: function (delayInSecond, fileName, params) {
            setTimeout((() => runOneTimesTask(fileName, loopbackApp, params)), delayInSecond * 1000);
            LOGGER.scheduledTask(`Nonrepeat task ${fileName} will execute after ${delayInSecond} second`);
        },
        scheduleTask: function (cronTimeExpression, fileName, params = null) {
            scheduler.schedule(cronTimeExpression, (() => runOneTimesTask(fileName, loopbackApp, params)), true);
            LOGGER.scheduledTask(`Task ${fileName} has just scheduled at ${cronTimeExpression}`);
        },
        //Insert a task into DB
        addTaskToDB: function (time, repeat, fileName, callback, params = null) {
            loopbackApp.models.scheduledTask.create({
                fileName: fileName,
                time: time,
                repeat: repeat,
                params: params
            }, function (err, obj) {
                if (err) {
                    LOGGER.scheduledTask(`There is an error occured while inserting a new task into DB \n ${err}`);
                } else {
                    LOGGER.scheduledTask(`A new task was inserted into DB \n ${JSON.stringify(obj)}`);
                    callback(obj.id);
                }
            });
        },
        //Execute task after it was added into DB
        executeAfterAddedToDB: function (timeOrCronExpression, repeat, fileName, params = null) {
            this.addTaskToDB(timeOrCronExpression, repeat, fileName, function (taskId) {
                TASKSCHEDULER.executeTaskFromDB(timeOrCronExpression, repeat, fileName, taskId);
            }, params);
        }
    };

    //LOAD SCHEDULED TASK FROM DB
    var taskModel = loopbackApp.models.scheduledTask;
    taskModel.find({}, function (err, listScheduledTask) {
        if (err) {
            LOGGER.scheduledTask(`There is an error occured while grabbing scheduled tasks from DB \n ${err}`);
        } else {
            for (var task of listScheduledTask) {
                LOGGER.scheduledTask(`Got task ${task.fileName} from DB (ID: ${task.id})`);
                TASKSCHEDULER.executeTaskFromDB(task.time, task.repeat, task.fileName, task.id);
            }
        }
    });
};
