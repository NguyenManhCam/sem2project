//PROVIDE STRIPE PAYMENT ENDPOINT
module.exports = function (loopbackApp, options) {
    loopbackApp.use('/chargeMoneyViaStripe', function (req, res, next) {
        // Set your secret key: remember to change this to your live secret key in production
        // See your keys here: https://dashboard.stripe.com/account/apikeys
        var stripe = require("stripe")(options.secretKey);

        // Token is created using Stripe.js or Checkout!
        // Get the payment token ID submitted by the form:
        var token = req.query.stripeToken; // Using Express
        var businessId = req.query.businessId;

        if (!token || !businessId) {
            res.status(400).send(APPCONFIG.appError(`token and businessId parameters are required`, APPCONFIG.errorCodes.invalid));
        } else {
            loopbackApp.models.business.findById(businessId, function (err, business) {
                if (err || !business) {
                    LOGGER.info(`An error occured while finding business ${businessId} \n ${err}`);
                    res.status(400).send(APPCONFIG.appError(`An error occured or business was not found`));
                } else {
                    var amount = options.subscriptionFee.business;                   
                    if (amount) {
                        var amountCharge = Math.round(amount * 100)
                        // Charge the user's card:
                        var charge = stripe.charges.create({
                            amount: amountCharge,
                            currency: options.currency,
                            description: `Business charged ${amount} ${options.currency} for business package`,
                            source: token,
                        }, function (err, charge) {
                            if (err || !charge) {
                                LOGGER.info(`An error occurred while charging ${amount} ${options.currency} cents of business ${business.id} via Stripe \n ${JSON.stringify(err)}`);
                                res.status(400).send(APPCONFIG.appError(`An error occurred while charging money of business`));
                            } else {
                                //Save transaction information
                                loopbackApp.models.businessTransaction.create({
                                    businessId: business.id,
                                    purchaseDate: (new Date()),
                                    stripleTransactionId: charge.id,
                                    success: charge.paid
                                }, function (err, createdObject) {
                                    if (err || !createdObject) {
                                        LOGGER.info(`An error occurred while saving Stripe transaction information of business ${business.id} \n ${JSON.stringify(err)}`);
                                        LOGGER.info(charge);
                                        LOGGER.doNotDelete(`An error occurred while saving Stripe transaction information of business ${business.id} \n ${JSON.stringify(charge)}`);
                                        res.status(400).send(APPCONFIG.appError(`An error occurred while charging money of business`));
                                    } else {
                                        res.status(200).send({
                                            success: true
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
};
