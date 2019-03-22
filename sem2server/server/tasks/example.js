//SCHEDULER WILL ALWAYS PASS AN INSTANCE OF APP OBJECT SO THIS TASK CAN MANIPULATE WITH DB
module.exports = function(loopbackApp) {
	loopbackApp.models.backendUser.find({}, function(err, arr){
		console.log(err);
		console.log(arr);
	});
}