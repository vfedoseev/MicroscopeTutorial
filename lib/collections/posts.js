Posts = new Mongo.Collection('posts');

var ownsDocument = function(userId, doc) {
	return doc && doc.userId ==userId;
}

Posts.allow({
	/*insert: function(userId, doc) {
		//Allow only for registered users
		return !!userId;
	}*/
	update: ownsDocument,
	remove: ownsDocument
});

Posts.deny({
	update: function(userId, post, fieldNames) {
		return (_.without(fieldNames, 'url', 'title').length > 0);
	}
});

Meteor.methods({
	postInsert: function(postAttributes) {
		check(Meteor.userId(), String);
		check(postAttributes, {
			title: String,
			url: String
		});

		var postWithSameLink = Posts.findOne({url: postAttributes.url});
		if(postWithSameLink) {
			throw new Meteor.Error(302,"Posts is already exists", postWithSameLink._id)
			/*return {
				postExists: true,
				_id: postWithSameLink._id
			}*/
		}
		var user = Meteor.user();
		var post = _.extend(_.pick(postAttributes, 'url', 'message'), {
			title: postAttributes.title,
			userId: user._id,
			author: user.username,
			submitted: new Date()
		});
		var postId = Posts.insert(post);
		return postId;
	}
});