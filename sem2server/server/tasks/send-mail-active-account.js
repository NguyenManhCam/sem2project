//SCHEDULER WILL ALWAYS PASS AN INSTANCE OF APP OBJECT SO THIS TASK CAN MANIPULATE WITH DB

module.exports = function (loopbackApp, object) {
    var recipient = [object.email]; // email of user request
    var context = {
        subject: 'Active account',
        message: object.message,
        link: object.link,
        object: object,
    }
    var emailTemplateFileName = 'active-account.html';
    EMAILSENDER.sendEmail(emailTemplateFileName, recipient, context);
    LOGGER.scheduledTask(`Sent email to ${JSON.stringify(recipient)} using template ${emailTemplateFileName}`);
}
