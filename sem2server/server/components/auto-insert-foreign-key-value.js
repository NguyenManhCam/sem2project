/* Automatically fill value for foreign keys when creating new model. Conditions:
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
    /* relationDirectory OBJECT STRUCTURE:
    {
        foreignModelName: {
            primaryModelName: {
				mainForeignKey: "",
				otherForeignKeys: [],
				keyInPairWithOtherForeignKey: []
			}
        }
    }
    */
    var relationDirectory = {};

    for (var currentModel of listAppModels) {
        // CHECK ALL REGISTERED MODELS IN ORDER TO FIND USER-DEFINED MODELS THAT HAS RELATION WITH EACH ORTHER
        if (currentModel.definition && currentModel.definition.settings.relations && listDefaultModels.indexOf(currentModel.definition.name) == -1) {
            //ANALYSIS RELATION CONFIGURATION IN ORDER TO CREATE relationDirectory
            for (var relation in currentModel.definition.settings.relations) {
                var relationConfig = currentModel.definition.settings.relations[relation];
                if (relationConfig.type && relationConfig.type === 'belongsTo' && relationConfig.foreignKey !== '' && relationConfig.primaryKey !== '') {
                    //CREATE DIRECTORY CONTAINS RELATIONS BETWEEN CURRENT MODEL AND PRIMARY MODEL
                    //THIS DIRECTORY WILL BE USED TO FILTER REQUEST BODY. IF A PROPERTY OF BODY MATCH WITH mainForeignKey
                    //OF THIS DIRECTORY THEN AUTOMATICALLY INSERT VALUE FOR FIELDS IN otherForeignKeys
                    if (!relationDirectory[currentModel.modelName]) {
                        relationDirectory[currentModel.modelName] = {};
                        relationDirectory[currentModel.modelName][relationConfig.model] = {
                            mainForeignKey: "",
                            otherForeignKeys: [],
                            keyInPairWithOtherForeignKey: []
                        };
                    } else if (!relationDirectory[currentModel.modelName][relationConfig.model]) {
                        relationDirectory[currentModel.modelName][relationConfig.model] = {
                            mainForeignKey: "",
                            otherForeignKeys: [],
                            keyInPairWithOtherForeignKey: []
                        };
                    }

                    if (relationConfig.primaryKey && relationConfig.primaryKey === "id") {
                        relationDirectory[currentModel.modelName][relationConfig.model].mainForeignKey = relationConfig.foreignKey;
                    } else {
                        relationDirectory[currentModel.modelName][relationConfig.model].otherForeignKeys.push(relationConfig.foreignKey);
                        relationDirectory[currentModel.modelName][relationConfig.model].keyInPairWithOtherForeignKey.push(relationConfig.primaryKey);
                    }
                }
            }
            // REGISTER A FUNCTION TO INSERT VALUE FOR FOREIGN KEYS IN otherForeignKeys
            currentModel.afterRemote('create', function (ctx, createdModel, next) {
                if (ctx.req.body) {
                    //IF THERE IS A PROPERTY OF REQUEST BODY MATCH WITH mainForeignKey THEN INSERT VALUE FOR FOREIGN KEYS IN otherForeignKeys
                    var currentModelName = ctx.method.sharedClass.name;
                    var relationData = relationDirectory[currentModelName];
                    if (relationData) {
                        for (var otherModelName in relationData) {
                            if (ctx.req.body[relationData[otherModelName].mainForeignKey]) {
                                var idOfCreatedModel = createdModel.id.toString();
                                getDataForUpdate(currentModelName, otherModelName, ctx.req.body[relationData[otherModelName].mainForeignKey], relationData[otherModelName].keyInPairWithOtherForeignKey, function (dataForUpdate) {
                                    var refinedData = {};
                                    for (var i = 0; i < relationData[otherModelName].keyInPairWithOtherForeignKey.length; i = i + 1) {
                                        refinedData[relationData[otherModelName].otherForeignKeys[i]] = dataForUpdate[relationData[otherModelName].keyInPairWithOtherForeignKey[i]];
                                    }
                                    loopbackApp.models[currentModelName].updateAll({
                                        id: idOfCreatedModel
                                    }, refinedData, function (err, info) {
                                        if (err) {
                                            LOGGER.info(`Could not automatically insert value for fields ${relationData[otherModelName].otherForeignKeys} of model ${currentModelName} \n ${err}`);
                                        } else {
                                            LOGGER.info(`Automatically inserted value for fields ${relationData[otherModelName].otherForeignKeys} of model ${currentModelName}`);
                                        }
                                    });
                                });
                            }
                        }
                    }
                    next();
                } else {
                    next();
                }
            });
        }
    }

    function getDataForUpdate(currentModelName, modelName, id, fields, cb) {
        loopbackApp.models[modelName].findById(id, {
            fields: fields
        }, function (err, instance) {
            if (err) {
                LOGGER.info(`Could not get ${modelName} with id ${id} in order to automatically insert value for fields ${fields} of model ${currentModelName} \n ${err}`);
            } else {
                cb(instance);
            }
        });
    };
};
