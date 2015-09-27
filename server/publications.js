//publish uses _publishCursor() when returning a cursor
Meteor.publish('posts', function(options){
	return Posts.find({}, options);
	return Posts.find({flagged: false, author: author});
});
Meteor.publish('singlePost', function(id) {
	check(id,String)
	return id && Posts.find(id);
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
	var currentUserId = this.userId;
	return Notifications.find({userId: currentUserId, read: false});
})