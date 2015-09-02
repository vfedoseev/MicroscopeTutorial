Errors = new Meteor.collection(null);

throwError = function(message) {
	Errors.insert({message: message});
}