var emailHelper = require('sendgrid').mail;
var sendgrid;
var fs = require('fs');
var EmailTemplates = require('swig-email-templates');
var getos = require('getos')
var path = require('path');

module.exports = function (loopbackApp, options) {
    sendgrid = require('sendgrid')(options.APIKey);

    global.EMAILSENDER = {
        //recipientEmailList: An array contains recipient's email address
        //params: An array contains values for parameters as specified in template
        send: function (templateFileName, recipientEmailList, params, subject) {
            LOGGER.email(`Start send email using template ${templateFileName}`);
            //READ EMAIL TEMPLATE FILE
            fs.readFile(options.templateFolder + templateFileName, 'utf8', function (err, data) {
                if (err) {
                    LOGGER.email(`There is an error occured while reading email template file ${templateFileName} \n ${JSON.stringify(err)}`);
                } else {
                    var emailTemplate = JSON.parse(data);
                    //SET PARAMETERS' VALUE IF ANY
                    for (var value of params) {
                        emailTemplate.content = emailTemplate.content.replace(/\$\{\w+\d+\}/, value);
                        if (emailTemplate.plainTextContent) {
                            emailTemplate.plainTextContent = emailTemplate.plainTextContent.replace(/\$\{\w+\d+\}/, value);
                        }
                    }

                    var emailSubject = subject || emailTemplate.subject;

                    //SEND EMAIL
                    for (var recipient of recipientEmailList) {
                        var email = new emailHelper.Mail(emailHelper.Email(options.fromEmail), emailSubject, emailHelper.Email(recipient), emailHelper.Content('text/plain', emailTemplate.plainTextContent ? emailTemplate.plainTextContent : ""));
                        email.addContent(emailHelper.Content('text/html', emailTemplate.content));
                        var request = sendgrid.emptyRequest({
                            method: 'POST',
                            path: '/v3/mail/send',
                            body: email.toJSON()
                        });
                        sendgrid.API(request, function (err, res) {
                            if (err) {
                                LOGGER.email(`There is an error occured while call Sendgrid API \n ${err.message} \n ${JSON.stringify(err.response)}`);
                            } else {
                                LOGGER.email(`Email sent`);
                            }
                        });
                    }
                }
            });
        },
        sendEmail: function (templateFileName, recipientEmailList, context) {
            LOGGER.email(`Start send email using template ${templateFileName}`);
            LOGGER.email(`Path folder email ${path.join('server', 'email-templates')}`);
            
            let pathEmail = path.join('server', 'email-templates');

            getos(function(e,os) {
                if(e) return console.log(e)
                if (os.os === 'win32') {
                    pathEmail = path.join('server', 'email-templates');
                }
                LOGGER.email("Your OS is:" +JSON.stringify(os));
            })
            //READ EMAIL TEMPLATE FILE
            console.log(pathEmail);

            var templates = new EmailTemplates({
                root: pathEmail,
                juice: {
                    webResources: {
                      images: false     // Inline images under 8kB
                    }
                },
                filters: {
                    formatNumber: function(str) {
                        var format = require('format-number-with-string');
                        var output = format(str, '##,###.#0');
                        return output;
                    },
                    formatDate: function(str, format = "dd/mm/yyyy") {
                        var dateFormat = require('dateformat');
                        var d = new Date(str.toString());
                        return dateFormat(d, format);
                    }
                }
            });
            templates.render(templateFileName, context, function (err, html, text, subject) {
                if (err) {
                    console.log(err)
                    LOGGER.email(`There is an error occured while reading email template file ${templateFileName} \n ${JSON.stringify(err)}`);
                } else {
                    //SEND EMAIL
                    for (var recipient of recipientEmailList) {
                        //console.log(context);
                        console.log(options.fromEmail);
                        //console.log(recipient);
                        //console.log(text);
                        console.log(recipient);
                        var textContent = new emailHelper.Content("text/plain", text);
                        var htmlContent = new emailHelper.Content('text/html', html);
                        var email = new emailHelper.Mail();
                        email.setFrom(new emailHelper.Email(options.fromEmail))
                        email.setSubject(context.subject);
                        email.addContent(textContent);
                        email.addContent(htmlContent);

                        var personalization = new emailHelper.Personalization();
                        var to = new emailHelper.Email(recipient);
                        personalization.addTo(to);

                        email.addPersonalization(personalization);

                        var request = sendgrid.emptyRequest({
                            method: 'POST',
                            path: '/v3/mail/send',
                            body: email.toJSON()
                        });
                        sendgrid.API(request, function (err, res) {
                            if (err) {
                                LOGGER.email(`There is an error occured while call Sendgrid API \n ${err.message} \n ${JSON.stringify(err.response)}`);
                            } else {
                                LOGGER.email(`Email sent`);
                            }
                        });
                    }
                }
            });
        }
    }
};
