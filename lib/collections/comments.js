Comments = new Meteor.Collection('comments');

Meteor.methods({
	comment: function(commentAttributes) {
		check(Meteor.userId(), String);
		check(commentAttributes, {
			body: String,
			postId: String
		});

		var user = Meteor.user();
		var post = Posts.findOne(commentAttributes.postId);

		if(!user) {
			throw new Meteor.Error(401, 'You need to login to make comments');
		}

		if(!commentAttributes.body) {
			throw new Meteor.Error(422, 'Please write some comment');
		}

		if(!post) {
			throw new Meteor.Error(422, 'You must comment post');
		}

		comment = _.extend(_.pick(commentAttributes, 'postId', 'body'), {
			userId: user._id,
			author: user.username,
			submitted: new Date().getTime()
		});
		Posts.update(comment.postId, {$inc: {commentsCount: 1}})
		comment._id = Comments.insert(comment);
		//Create notification
		createCommentNotification(comment);
		return comment._id;
	}
});

