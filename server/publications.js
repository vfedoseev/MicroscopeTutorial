//publish uses _publishCursor() when returning a cursor
Meteor.publish('posts', function(author){
	return Posts.find();
	return Posts.find({flagged: false, author: author});
});

Meteor.publish('allPosts', function(author){
	return Posts.find({author: author}, {fields: {
		date: false
	}});
});