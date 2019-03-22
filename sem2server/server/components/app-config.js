//READ APP CONFIG FROM COMPONENT-CONFIG.JSON FILE
module.exports = function (loopbackApp, options) {
    global.APPCONFIG = options;

    var path = require('path');
    APPCONFIG.serverPath = `${path.resolve()}`;
    APPCONFIG.productionUrl = 'http://localhost:3000';

    //Define custom error format
    APPCONFIG.appError = function (message, code, statusCode) {
        var Error = {
            statusCode: statusCode ? statusCode : options.error.statusCode,
            name: options.error.name,
            message: message ? message : "",
            code: code ? code : ""
        };
        return Error;
    };

};
