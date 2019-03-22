//SCHEDULER WILL ALWAYS PASS AN INSTANCE OF APP OBJECT SO THIS TASK CAN MANIPULATE WITH DB
module.exports = function (loopbackApp) {
    LOGGER.scheduledTask(`Counting number of business created yesterday`);
    var today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    var tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    loopbackApp.models.business.count({
        and: [{
                createDate: {
                    gte: yesterday
                }
            },
            {
                createDate: {
                    lt: today
                }
            }
        ]
    }, function (err, info) {
        if (err || !info) {
            LOGGER.scheduledTask(`An error occurred while counting number of business created yesterday \n ${err}`);
        } else {
            //Do not create a new record if there is a record for today
            loopbackApp.models.analyticData.upsertWithWhere({
                and: [{
                        lastUpdate: {
                            gte: today
                        }
                    },
                    {
                        lastUpdate: {
                            lt: tomorrow
                        }
                    },
                    {
                        type: APPCONFIG.analyticKeys.businessCreatedEveryday
                    }
                ]
            }, {
                type: APPCONFIG.analyticKeys.businessCreatedEveryday,
                criterial: yesterday.toISOString(),
                amount: info,
                lastUpdate: (new Date())
            }, function (err, createdModel) {
                if (err) {
                    if (err.message.indexOf('multiple instances found') !== -1) {
                        LOGGER.scheduledTask(`Analytic records for today was exists, skipped to insert new ones`);
                    } else {
                        LOGGER.scheduledTask(`An error occurred while insert/updated counting number of business created yesterday \n ${err}`);
                    }
                } else {
                    LOGGER.scheduledTask(`inserted/updated counting number of business created yesterday`);
                }
            });
        }
    });
}
