var winston = require('winston');
winston.remove(winston.transports.Console);
global.LOGGER = {
    infoLogger: undefined,
    scheduledTaskLogger: undefined,
    emailLogger: undefined,
    pushNotificationLogger: undefined,
    chatServerLogger: undefined,
    doNotDeleteLogger: undefined,
    info: function (msg) {
        this.infoLogger.info(msg);
    },
    scheduledTask: function (msg) {
        this.scheduledTaskLogger.info(msg);
    },
    email: function (msg) {
        this.emailLogger.info(msg);
    },
    pushNotification: function (msg) {
        this.pushNotificationLogger.info(msg);
    },
    chatServer: function (msg) {
        this.chatServerLogger.info(msg);
    },
    doNotDelete: function (msg) {
        this.doNotDeleteLogger.info(msg);
    }
};
LOGGER.infoLogger = new(winston.Logger);
LOGGER.scheduledTaskLogger = new(winston.Logger);
LOGGER.emailLogger = new(winston.Logger);
LOGGER.pushNotificationLogger = new(winston.Logger);
LOGGER.chatServerLogger = new(winston.Logger);
LOGGER.doNotDeleteLogger = new(winston.Logger);
LOGGER.infoLogger.add(require('winston-daily-rotate-file'), {
    filename: 'logs/info.on',
    datePattern: '.yyyy-MM-dd.txt',
    prepend: false,
    localTime: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    maxsize: 100000,
    json: false,
    exitOnError: false,
    name: 'information',
    level: 'info'
});
LOGGER.scheduledTaskLogger.add(require('winston-daily-rotate-file'), {
    filename: 'logs/scheduledTask.on',
    datePattern: '.yyyy-MM-dd.txt',
    prepend: false,
    localTime: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    maxsize: 100000,
    json: false,
    exitOnError: false,
    name: 'scheduledTask',
    level: 'info'
});
LOGGER.emailLogger.add(require('winston-daily-rotate-file'), {
    filename: 'logs/email.on',
    datePattern: '.yyyy-MM-dd.txt',
    prepend: false,
    localTime: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    maxsize: 100000,
    json: false,
    exitOnError: false,
    name: 'email',
    level: 'info'
});
LOGGER.pushNotificationLogger.add(require('winston-daily-rotate-file'), {
    filename: 'logs/push-notification.on',
    datePattern: '.yyyy-MM-dd.txt',
    prepend: false,
    localTime: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    maxsize: 100000,
    json: false,
    exitOnError: false,
    name: 'pushNotification',
    level: 'info'
});
LOGGER.chatServerLogger.add(require('winston-daily-rotate-file'), {
    filename: 'logs/chat-server.on',
    datePattern: '.yyyy-MM-dd.txt',
    prepend: false,
    localTime: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    maxsize: 100000,
    json: false,
    exitOnError: false,
    name: 'chatServer',
    level: 'info'
});
LOGGER.doNotDeleteLogger.add(require('winston-daily-rotate-file'), {
    filename: 'logs/do-not-delete.on',
    datePattern: '.yyyy-MM-dd.txt',
    prepend: false,
    localTime: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    maxsize: 100000,
    json: false,
    exitOnError: false,
    name: 'doNotDelete',
    level: 'info'
});

module.exports = function (loopbackApp, options) {
    //Hook LOGGER into router in order to record request data
    loopbackApp.use(function (req, res, next) {
        LOGGER.info(`USER ${req.cookies && req.cookies.currentUserId ? req.cookies.currentUserId : req.ip} SENT A ${req.method} REQUEST TO \n ${req.originalUrl} \n ${JSON.stringify(req.query)} ${req.body ? JSON.stringify(req.body) : ''} ${req.params ? JSON.stringify(req.params) : ''}`);
        next();
    });
    //Hook LOGGER into router in order to record error
    loopbackApp.middleware('final:before', function (err, req, res, next) {
        if (err) {
            LOGGER.info(err);

            if (typeof err !== "object") {
                err = JSON.parse(err);
            }

            var errorObj = {
                error: {
                    statusCode: 400,
                    name: "Error",
                    message: "",
                    code: "",
                    details: ""
                }
            };

            if (err.details) {
                errorObj.error.details = err.details;
            }

            // Regular expression is used to split error name to words. Ex: ValidationError will be splitted to Validation and Error
            var reg = new RegExp('[A-Z]{1}[a-z]+', 'g');
            if (err.statusCode && err.statusCode === 422) {
                for (var i = 0; i < 10; i = i + 1) {
                    var result = reg.exec(err.name);
                    if (result != null) {
                        errorObj.error.code = errorObj.error.code + result[0].toUpperCase() + '_';
                    } else {
                        errorObj.error.code = errorObj.error.code.substring(0, errorObj.error.code.length - 1);
                        break;
                    }
                }
                errorObj.error.message = err.message;

                err = errorObj;
            } else if (!err.error) {
                errorObj.error = err;
                err = errorObj;
            }
            var end = res.end;
            res.end = function (data, encoding) {
                this.statusCode = err.error.statusCode || 400;
                end.call(this, JSON.stringify(err), encoding);
                //Re-assign res.end to original handler so this function will not be called again
                res.end = end;
            };
            res.end();
        } else {
            next();
        }
    });
};
