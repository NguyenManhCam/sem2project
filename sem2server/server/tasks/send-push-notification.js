//SCHEDULER WILL ALWAYS PASS AN INSTANCE OF APP OBJECT SO THIS TASK CAN MANIPULATE WITH DB
module.exports = function (loopbackApp, pushNotificationApp) {
    var title = pushNotificationApp.subject ? pushNotificationApp.subject : '';
    var content = pushNotificationApp.content ? pushNotificationApp.content : '';

    //Convert all properties of extraContent to string
    for (var prop in pushNotificationApp.extraContent) {
        pushNotificationApp.extraContent[prop] = pushNotificationApp.extraContent[prop].toString();
    }

    var payload = {
        notification: {
            title: title.toString(),
            text: content.toString()
        },
        data: pushNotificationApp.extraContent ? pushNotificationApp.extraContent : {}
    };

    if (pushNotificationApp.targetUser) {
        //all user
        let topic = '';
        if (pushNotificationApp && pushNotificationApp.targetUser === 'All Registered Users') {
            topic = pushNotificationApp.targetUser;
        } else  if (pushNotificationApp && !pushNotificationApp.city && !pushNotificationApp.state) {
            topic = `${pushNotificationApp.city}_${pushNotificationApp.state}`;
        } else if (pushNotificationApp && !pushNotificationApp.city) {
            topic = pushNotificationApp.city;
        } else {
            topic = pushNotificationApp.targetUser;
        }

        if (topic !== '') {
            topic = topic.replace(/\s/g, '')

            PUSHNOTIFICATION.sendObjectToTopic(payload, topic).then(function () {
                LOGGER.scheduledTask(`Push notification ${pushNotificationApp.id} was successfully sent to topic ${topic}`);
                updatePushNotificationStatus(loopbackApp, pushNotificationApp.id, 'sent');
            }).catch(function (err) {
                LOGGER.scheduledTask(`An error occurred while sending push notification ${pushNotificationApp.id} to topic ${topic} \n ${err}`);
                updatePushNotificationStatus(loopbackApp, pushNotificationApp.id, 'failed');
            });
            LOGGER.scheduledTask(`Started sending push notification ${pushNotificationApp.id} to topic ${topic}`);
        } else {
            LOGGER.scheduledTask(`An error occurred while sending push notification ${pushNotificationApp.id} to topic ${topic}`);
        }
    } else {
        LOGGER.scheduledTask(`Could not send push notification because recipient was unknown. Both recipientId and topic were not existed`);
        updatePushNotificationStatus(loopbackApp, pushNotificationApp.id, 'invalid');
    }
}

function updatePushNotificationStatus(loopbackApp, id, status) {
    loopbackApp.models.notification.updateAll({
        id: id
    }, {
        status: status
    }, function (err, updatedModel) {
        if (err) {
            LOGGER.scheduledTask(`An error occurred while updating status of push notification ${id} \n ${err}`);
        } else {
            LOGGER.scheduledTask(`Push notification ${id} was changed to status ${status}`);
        }
    });
};
