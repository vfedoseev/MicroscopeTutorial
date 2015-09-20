//publish uses _publishCursor() when returning a cursor
Meteor.publish('posts', function(author){
	return Posts.find();
	return Posts.find({flagged: false, author: author});
});

Meteor.publish('comments', function(postId){
	check(postId,String)
	return Comments.find({postId: postId});
});
Meteor.publish('allPosts', function(author){
	return Posts.find({author: author}, {fields: {
		date: false
	}});
});

Meteor.publish('notifications', function() {
	return Notifications.find();
})