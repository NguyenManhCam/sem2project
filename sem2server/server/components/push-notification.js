var firebase = require("firebase-admin");

module.exports = function (loopbackApp, options) {
    //INITIALIZE ANDROID PUSH NOTIFICATION COMPONENT
    firebase.initializeApp({
        credential: firebase.credential.cert(options.pushKey),
        databaseURL: `https://${options.databaseName}.firebaseio.com`
    });

    // SUBSCRIBE TO A DEFINED TOPIC
    function subscribeToATopicOrNot(reg_token, topicName, subscribe) {
        return new Promise(function (resolve, reject) {
            if (subscribe) {
                firebase.messaging().subscribeToTopic(reg_token, topicName)
                    .then(function (response) {
                        if (response.successCount && response.successCount > 0) {
                            LOGGER.pushNotification(`registrationToken ${reg_token} was added to topic ${topicName}`);
                            resolve(topicName);
                        } else {
                            var errMessage = `Could not add ${reg_token} to topic ${topicName} \n ${JSON.stringify(response.errors)}`;
                            LOGGER.pushNotification(errMessage);
                            reject(new Error(errMessage));
                        }
                    })
                    .catch(function (err) {
                        var errMessage = `An error occurred when adding ${reg_token} to topic ${topicName}`;
                        LOGGER.pushNotification(errMessage);
                        LOGGER.pushNotification(err);
                        reject(new Error(errMessage));
                    });

            } else {
                firebase.messaging().unsubscribeFromTopic(reg_token, topicName)
                    .then(function (response) {
                        if (response.successCount && response.successCount > 0) {
                            LOGGER.pushNotification(`registrationToken ${reg_token} was removed from topic ${topicName}`);
                            resolve(topicName);
                        } else {
                            var errMessage = `Could not remove ${reg_token} from topic ${topicName} \n ${JSON.stringify(response.errors)}`;
                            LOGGER.pushNotification(errMessage);
                            reject(new Error(errMessage));
                        }
                    })
                    .catch(function (err) {
                        var errMessage = `An error occurred when removing ${reg_token} from topic ${topicName}`;
                        LOGGER.pushNotification(errMessage);
                        LOGGER.pushNotification(err);
                        reject(new Error(errMessage));
                    });
            }
        });
    };

    // SEND A DATA OBJECT TO GROUP
    function sendObjectToGroup(payload, groupNotificationKey) {
        return new Promise(function (resolve, reject) {
            firebase.messaging().sendToDeviceGroup(groupNotificationKey, payload)
                .then(function (response) {
                    if (response.successCount && response.successCount > 0) {
                        LOGGER.pushNotification(`Object ${JSON.stringify(payload)} already sent to ${response.successCount} device group ${groupNotificationKey}`);
                    }
                    if (response.failureCount && response.failureCount > 0) {
                        LOGGER.pushNotification(` ${response.failureCount} Object ${JSON.stringify(payload)} could not be sent to device group ${groupNotificationKey}`);
                    }
                    resolve();
                })
                .catch(function (err) {
                    var errMessage = `An error occurred when sending Object ${JSON.stringify(payload)} to device group ${groupNotificationKey}`;
                    LOGGER.pushNotification(errMessage);
                    LOGGER.pushNotification(err);
                    reject(new Error(errMessage));
                });
        });
    };

    // SEND A DATA OBJECT TO DEVICE
    function sendObjectToDevice(payload, registrationToken) {
        return new Promise(function (resolve, reject) {
            firebase.messaging().sendToDevice(registrationToken, payload)
                .then(function (response) {
                    LOGGER.pushNotification(`Object ${JSON.stringify(payload)} already sent to ${response} device ${registrationToken}`);
                    resolve();
                })
                .catch(function (err) {
                    var errMessage = `An error occurred when sending Object ${JSON.stringify(payload)} to device ${registrationToken}`;
                    LOGGER.pushNotification(errMessage);
                    LOGGER.pushNotification(err);
                    reject(new Error(errMessage));
                });
        });
    };

    // SEND MESSAGE TO A GROUP
    function sendMessageToGroup(title, message, groupNotificationKey) {
        return sendObjectToGroup({
            notification: {
                title: title,
                text: message
            },
            data: {
                title: title,
                message: message
            }
        }, groupNotificationKey);
    };

    // SEND A DATA OBJECT TO TOPIC
    function sendObjectToTopic(payload, topicName) {
        return new Promise(function (resolve, reject) {
            firebase.messaging().sendToTopic(topicName, payload)
                .then(function (response) {
                    LOGGER.pushNotification(`Object ${JSON.stringify(payload)} already sent to topic ${topicName}`);
                    resolve();
                })
                .catch(function (err) {
                    var errMessage = `An error occurred when sending Object ${JSON.stringify(payload)} to topic ${topicName}`;
                    LOGGER.pushNotification(errMessage);
                    LOGGER.pushNotification(err);
                    reject(new Error(errMessage));
                });
        });
    };

    // SEND MESSAGE TO A GROUP
    function sendMessageToTopic(title, message, topicName) {
        return sendObjectToTopic({
            notification: {
                title: title,
                text: message
            },
            data: {
                title: title,
                message: message
            }
        }, topicName);
    };

    global.PUSHNOTIFICATION = {
        subscribeToATopicOrNot: subscribeToATopicOrNot,
        sendMessageToGroup: sendMessageToGroup,
        sendObjectToGroup: sendObjectToGroup,
        sendMessageToTopic: sendMessageToTopic,
        sendObjectToTopic: sendObjectToTopic,
        sendObjectToDevice: sendObjectToDevice
    };
};
