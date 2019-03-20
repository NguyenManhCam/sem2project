module.exports = function (loopbackApp, options) {
    var listAppModels = loopbackApp.models();
    var app = require('../../server/server');
    for (var currentModel of listAppModels) {
        currentModel.observe('after delete', function (ctx, next) {
            if (ctx.instance && ctx.instance.id) {
                app.models.fileInfo.deleteAll({
                    ownerId: ctx.instance.id
                }, function (err, info) {
                    if (err) {
                        LOGGER.info(`Cannot delete fileInfo reference by ${ctx.instance.id} with ${err}`);
                    }
                });
            }
            next();
        });
    }
};
