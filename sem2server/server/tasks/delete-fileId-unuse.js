module.exports = function (loopbackApp, fileId) {
    //if fileId is file url
    let arrayFile = fileId.split('/');
    if (arrayFile.length > 1) {
        fileId = arrayFile.pop();
    }
    LOGGER.scheduledTask(`Start delete fileId ${fileId}`);
    loopbackApp.models.fileInfo.destroyById(fileId, function (er) {
        if (er) {
            LOGGER.doNotDelete(`An error occurred delete fileId \n ${err}`);
        }
        else
        {
            LOGGER.scheduledTask(`delete unuse fileId ${fileId} successfully!`);
        }
    });
}
