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
			submitted: new Date(),
			commentsCount: 0,
			upvoters: [],
			votes: 0
		});
		var postId = Posts.insert(post);
		return postId;
	},
	upvote: function(postId) {
		check(postId,String);
		var user = Meteor.user();
		if(!user) {
			throw new Meteor.Error(401, 'Please log in to vote');
		}

		Posts.update({
			_id: postId,
			upvoters: {$ne: user._id}
		}, {
			$addToSet: {upvoters: user._id},
			$inc: {votes: 1}
		});
		/*var post = Posts.findOne(postId);
		if(!post) {
			throw new Meteor.Error(422, 'Post does not exists');
		}
		if(_.include(post.upvoters, user._id)) {
			throw new Meteor.Error(422, 'You have already voted. Sorry');
		}

		Posts.update(post._id, {
			$addToSet: {upvoters: user._id},
			$inc: {votes: 1}
		})*/
	}
});