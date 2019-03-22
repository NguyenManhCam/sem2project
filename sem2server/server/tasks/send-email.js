//SCHEDULER WILL ALWAYS PASS AN INSTANCE OF APP OBJECT SO THIS TASK CAN MANIPULATE WITH DB
// params: An array contains parameters
// first element is recipient
// second one is email subject
// third one is email contet
// forth one is id of model inserted
module.exports = function (loopbackApp, params, taskId) {
    var recipient = [params[0]];
    var subject = params[1];
    var content = [params[2]];
    var emailTemplateFileName = params[3] ? params[3] : "normal-email.json";

    EMAILSENDER.send(emailTemplateFileName, recipient, content, subject);
    LOGGER.scheduledTask(`Sent email to ${JSON.stringify(recipient)} using template ${emailTemplateFileName}`);
}
