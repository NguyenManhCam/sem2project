//If value is false, this module will create default users and grant default roles. Otherwise do nothing
function createRootUser() {
    return new Promise(function (resolve, reject) {
        LOGGER.info('Initialize Root user');

        var User = app.models.rootUser;

        User.findOrCreate({ where: { username: defaultConfig.rootUserName } }, {
            username: defaultConfig.rootUserName,
            email: defaultConfig.rootEmail,
            password: defaultConfig.rootPassword
        }, function (err, user) {
            if (err) {
                LOGGER.info(err);
                reject(err);
            } else {
                LOGGER.info('Root user was initialized');
                resolve(user);
            }
        });
    });
};

function grantRootRoles(rootUserId) {
    return new Promise(function (resolve, reject) {
        var Role = app.models.Role;
        var RoleMapping = app.models.RoleMapping;

        var counter = 0;
        var roleList = defaultConfig.rootRoles;
        roleList.push(defaultConfig.superRootRole);

        for (var rootRole of roleList) {
            //CREATE OR RETRIEVE A ROLE
            LOGGER.info(`Creating role ${rootRole}`);
            Role.findOrCreate({
                where: {
                    name: rootRole
                }
            }, {
                    name: rootRole
                }, function (err, role) {
                    if (err) {
                        LOGGER.info(err);
                        reject(err);
                    } else {
                        LOGGER.info(`Role ${role.name} was initialized`);

                        //GRANT ROLE TO USER
                        role.principals.findOne({
                            principalType: RoleMapping.USER,
                            principalId: rootUserId
                        }, function (err, existRoleMapping) {
                            if (err) {
                                LOGGER.info(err);
                                reject(err);
                            } else {
                                if (existRoleMapping) {
                                    LOGGER.info(`Root user already assign to ${role.name} role`);
                                    counter = counter + 1;
                                    if (counter === roleList.length) {
                                        resolve();
                                    }
                                } else {
                                    role.principals.create({
                                        principalType: RoleMapping.USER,
                                        principalId: rootUserId
                                    }, function (err, principal) {
                                        if (err) {
                                            LOGGER.info(err);
                                            reject(err);
                                        } else {
                                            LOGGER.info(`Root user was assigned ${role.name} role`);
                                        }
                                        counter = counter + 1;
                                        if (counter === roleList.length) {
                                            resolve();
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
        }
    });
};

function createAllOtherRoles() {
    return new Promise(function (resolve, reject) {
        var Role = app.models.Role;

        var otherRoles = APPCONFIG.backendRoles;

        var counter = 0;

        for (var otherRole of otherRoles) {
            //Create roles
            LOGGER.info(`Creating role ${otherRole}`);
            Role.findOrCreate({
                where: {
                    name: otherRole
                }
            }, {
                    name: otherRole
                }, function (err, role) {
                    if (err) {
                        LOGGER.info(err);
                        reject(err);
                    } else {
                        LOGGER.info(`Role ${role.name} was initialized`);
                        counter = counter + 1;
                        if (counter === otherRoles.length) {
                            resolve();
                        }
                    }
                });
        }
    });
}

//INVOKE ALL OTHER FUNCTIONS IN ORDER TO CREATE INIT MEMBERSHIP DATA
function initialize() {
    if (!APPCONFIG.membershipInitialized) {
        LOGGER.info('Initialize root user and roles');
        createRootUser().then(function (rootUser) {
            grantRootRoles(rootUser.id).then(() => {
                createAllOtherRoles().then(() => {
                    LOGGER.info('Initialized root user and roles');
                }).catch(() => {
                    LOGGER.info(`Error occurred \n ${err}`);
                    process.exit();
                });
            }).catch((err) => {
                LOGGER.info(`Error occurred \n ${err}`);
                process.exit();
            });
        }).catch((err) => {
            LOGGER.info(`Error occurred \n ${err}`);
            process.exit();
        });
    }
};

//PREVENT BRUTE-FORCE ATTACK AND STORE CURRENT USER ID INTO COOKIE
function preventManyLoginAttempts() {
    var expressBrute = require('express-brute'),
        store = new expressBrute.MemoryStore();

    //Brute-force configuration per IP
    var userBruteforce = new expressBrute(store, {
        freeRetries: defaultConfig.loginRetries,
        attachResetToRequest: true,
        refreshTimeoutOnRequest: false,
        minWait: defaultConfig.minWait,
        maxWait: defaultConfig.maxWait,
        failCallback: function (req, res, next, nextValidRequestDate) {
            LOGGER.info(`Too many login attempts from ${req.ip}, temporarely prevent login in a while`);
            next();
        }
    });

    // No more than 1000 login attempts per day per IP 
    var globalBruteforce = new expressBrute(store, {
        freeRetries: defaultConfig.maxRetriesPerDay,
        attachResetToRequest: false,
        refreshTimeoutOnRequest: false,
        minWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time) 
        maxWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time) 
        lifetime: 24 * 60 * 60, // 1 day (seconds not milliseconds)
        failCallback: function (req, res, next, nextValidRequestDate) {
            LOGGER.info(`Too many login attempts from ${req.ip}, prevent login in 1 day`);
            next();
        }
    });

    for (var url of defaultConfig.listLoginUrl) {
        app.post(url, globalBruteforce.prevent,
            userBruteforce.getMiddleware(),
            //Hook into End function of Response in order to reset counter of Bruteforce
            function (req, res, next) {
                var end = res.end;
                res.end = function (data, encoding) {
                    //Just reset counter of Bruteforce if login successfully
                    if (this.statusCode === 200) {
                        req.brute.reset();

                        var expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + (APPCONFIG.defaultTtl / 86400));

                        if (!req.remotingContext.result.userId) {
                            res.cookie('currentUserId', req.remotingContext.result.id.toString(), { expires: new Date(expireDate) });
                            res.cookie('accessToken', req.remotingContext.result.token.toString(), { expires: new Date(expireDate) });
                        } else {
                            res.cookie('currentUserId', req.remotingContext.result.userId.toString(), { expires: new Date(expireDate) });
                            res.cookie('accessToken', req.remotingContext.result.id.toString(), { expires: new Date(expireDate) });
                        }

                        res.cookie('currentUserType', req.baseUrl.substring(req.baseUrl.lastIndexOf('/') + 1), { expires: new Date(expireDate) });
                    }
                    end.call(this, data, encoding);
                    //Re-assign res.end to original handler so this function will not be called again
                    res.end = end;
                };
                next();
            });
        LOGGER.info(`Set brute-force protection for ${url}`);
    }
}

var app;
var defaultConfig;

module.exports = function (loopbackApp, options) {
    app = loopbackApp;
    defaultConfig = options;
    APPCONFIG.rootRoles = options.rootRoles;
    APPCONFIG.backendRoles = options.backendRoles;
    initialize();
    preventManyLoginAttempts();
};
