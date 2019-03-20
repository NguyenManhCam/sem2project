module.exports = function (loopbackApp, params) {
    LOGGER.scheduledTask(`Running scheduledTask check hunting end`);
    let Frontenduser = loopbackApp.models.frontendUser;
    Frontenduser.getDataSource().connector.connect(function (err, db) {
        var collection = db.collection(Frontenduser.modelName);
        //Retrieve messages of current user with recipient is unique
        collection.aggregate([{
            $group: {
                _id: '$state'
            }
        }], function (err, data) {
            if (err) {
                LOGGER.info(`An error occurred while get state list of frontendUser for check hunting end \n ${err}`);
            } else {

                for (var i = 0; i < data.length; i = i + 1) {
                    if (data[i]) {
                        getEventRunning(data[i])
                    }
                }
            }
        });
    });

    function getEventRunning(state) {
        let dateTimeNow = new Date().toISOString();
        Treehuntevent.findOne({
            where: {
                and: [{
                        startDateEvent: {
                            lte: dateTimeNow
                        }
                    },
                    {
                        endDate: {
                            gte: dateTimeNow
                        }
                    },
                    {
                        state: {
                            eq: state
                        }
                    }
                ]
            }
        }, function (err, event) {
            if (err) {
                LOGGER.info(`An error occured while get current event ${state} \n ${err}`);
            }
            else {
                if (new Date().toISOString() >= event.endDate) {
                    loopbackApp.models.notification.create({
                        title: 'The hunting was over',
                        content: 'We found the Winner!!! Check now!',
                        senderId: 'system',
                        senderName: 'system',
                        type: 'normal',
                        scheduleTime: new Date(),
                        targetUser: event.state
                    }, function (err, notification) {
                        if (err) {
                            LOGGER.doNotDelete(`An error occurred while creating notification when hunting end \n ${JSON.stringify(err)}`);
                        }
                    })
                }
            }
        });
    };
}
