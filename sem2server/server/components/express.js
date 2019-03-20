//INITIALIZE EXPRESSJS MODULES THAT DID NOT INTEGRATED INTO LOOPBACK
module.exports = function(loopbackApp, options) {
    var cookieParser = require('cookie-parser');
    loopbackApp.use(cookieParser());
};
