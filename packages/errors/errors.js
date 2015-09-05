Errors = {
	collection: new Meteor.Collection(null), 

	throw: function(message) {
		console.log('message');
		Errors.collection.insert({message: message, seen: false});
	},
	clearSeen: function() {
		Errors.collection.remove({seen: true});
	}
}