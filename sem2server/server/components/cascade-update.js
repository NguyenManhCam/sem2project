/* Cascade update foreign models if primary model was updated. To ensure that an foreign model will be updated, its' configuration must match with the following conditions:
1. configuration of relation must always contain primary key
2. Have a relation with value of primary key is id of primary model 
*/
module.exports = function (loopbackApp, options) {
    var listDefaultModels = options.defaultModels;
    var listAppModels = loopbackApp.models();
    // SPECIAL FORMATS OF FOREIGN KEY. STRING/BOOLEAN/NUMBER FORMAT IS SUPPOSED AS DEFAULT
    var specialForeignKeyFormat = {
        array_object: "array_object"
    };
    /* OBJECT STRUCTURE:
    {
        primaryModel: {
            foreignModel: [{
                primaryKey,
                foreignKey
            }]
        }
    }
    */
    var relationDirectory = {};

    for (var foreignModel of listAppModels) {
        // CHECK ALL REGISTERED MODELS IN ORDER TO FIND USER-DEFINED MODELS THAT HAS RELATION WITH EACH ORTHER
        if (foreignModel.definition && foreignModel.definition.settings.relations && listDefaultModels.indexOf(foreignModel.definition.name) == -1) {
            for (var relation in foreignModel.definition.settings.relations) {
                var relationConfig = foreignModel.definition.settings.relations[relation];
                if (relationConfig.type && relationConfig.type === 'belongsTo' && relationConfig.foreignKey !== '' && relationConfig.primaryKey !== '') {
                    // CREATE PRIMARY MODEL OBJECT
                    var primaryModel = loopbackApp.registry.findModel(relationConfig.model);
                    if (!relationDirectory[relationConfig.model]) {
                        relationDirectory[relationConfig.model] = {};
                    }
                    // CREATE FOREIGN MODEL OBJECT THAT BELONGS TO THE PRIMARY MODEL
                    if (!relationDirectory[relationConfig.model][foreignModel.definition.name]) {
                        relationDirectory[relationConfig.model][foreignModel.definition.name] = [];

                        // REGISTER A FUNCTION TO UPDATE FOREIGN MODEL WHEN PRIMARY MODEL WAS UPDATED/PATCHED
                        primaryModel.afterRemote('prototype.patchAttributes', function (ctx, updatedModel, next) {
                            // FIND FOREIGN KEYS OF UPDATED MODEL IN REQUEST BODY AND COMPARE WITH relationDirectory
                            for (var foreignModelName in relationDirectory[ctx.method.sharedClass.name]) {
                                LOGGER.info(`Start update foreign model ${foreignModelName} because primary model ${ctx.method.sharedClass.name} was updated`);
                                var foreignModel = relationDirectory[ctx.method.sharedClass.name][foreignModelName];
                                var data = createDataForUpdating(foreignModel, ctx.req.body);
                                var condition = createConditionForUpdating(foreignModel, ctx.req.params);
                                // To avoid unexpected update, only execute update if condition is not undefined
                                if (condition && Object.keys(condition).length > 0 && data && Object.keys(data).length > 0) {
                                    updateForeignModel(foreignModelName, condition, data);
                                }
                            }
                            next();
                        });
                    }
                    // SAVE FOREIGN KEY OF PRIMARY MODEL TO relationDirectory
                    relationDirectory[relationConfig.model][foreignModel.definition.name].push({
                        primaryKey: relationConfig.primaryKey,
                        foreignKey: relationConfig.foreignKey,
                        foreignKeyFormat: relationConfig.foreignFormat
                    });
                }
            }
        }
    }

    function createDataForUpdating(foreignModel, reqBody) {
        var data = {};
        for (var attr in reqBody) {
            // IF AN ATTRIBUTE OF REQUEST BODY IS A PRIMARY KEY OF RELATION BETWEEN 2 MODELS
            for (var keys of foreignModel) {
                if (keys.foreignKeyFormat && specialForeignKeyFormat[keys.foreignKeyFormat]) {
                    // IF FORMAT OF FOREIGN KEY IS AN ARRAY OF STRINGS
                    if (keys.foreignKeyFormat === specialForeignKeyFormat.array_object) {
                        data[`${keys.foreignKey}.$.${attr}`] = reqBody[attr];
                    }
                }
                if (keys.primaryKey === attr) {
                    // THEN ADD ITS' VALUE TO DATA THAT WILL BE USED TO UPDATE FOR FOREIGN MODEL
                    data[keys.foreignKey] = reqBody[attr];
                }
            }
        }
        return data;
    };

    function createConditionForUpdating(foreignModel, reqParams) {
        var condition = {};
        for (var attr in reqParams) {
            // IF AN ATTRIBUTE OF REQUEST BODY IS A PRIMARY KEY OF RELATION BETWEEN 2 MODELS
            for (var keys of foreignModel) {
                // IF FORMAT OF FOREIGN KEY IS A SPECIAL ONE AS SPECIFIED BY specialForeignKeyFormat
                if (keys.foreignKeyFormat && specialForeignKeyFormat[keys.foreignKeyFormat]) {
                    if (keys.foreignKeyFormat === specialForeignKeyFormat.array_object) {
                        condition[`${keys.foreignKey}.${attr}`] = reqParams[attr];
                    }
                }
                // IF FORMAT OF FOREIGN KEY IS NOT A SPECIAL ONE AS SPECIFIED BY specialForeignKeyFormat
                else if (keys.primaryKey === attr) {
                    // THEN ADD VALUE FROM REQUEST PARAMETERS THAT WILL BE USED TO UPDATE FOR FOREIGN MODEL
                    condition[keys.foreignKey] = reqParams[attr];
                }
            }
        }
        return condition;
    };

    function updateForeignModel(foreignModelName, condition, data) {
        loopbackApp.registry.findModel(foreignModelName).updateAll(condition, data, function (err, updatedModel, count) {
            if (err) {
                LOGGER.info(`An error occured while updating foreign model ${foreignModelName} \n condition: \n ${condition} \n data \n ${data} \n ${err}`);
                throw err;
            } else {
                LOGGER.info(`${count ? count.count : 0} ${foreignModelName} foreign model were updated`);
            }
        });
    };
};
