//SCHEDULER WILL ALWAYS PASS AN INSTANCE OF APP OBJECT SO THIS TASK CAN MANIPULATE WITH DB
// params: An array contains parameters
// first element is recipient
// The rest elements are parameters for email template
module.exports = function (loopbackApp, params) {
    var recipient = [params[0]];
    params.shift();
    EMAILSENDER.send('contact-us.json', recipient, params);
    LOGGER.scheduledTask(`Sent contact us email to ${recipient[0]}`);
}
