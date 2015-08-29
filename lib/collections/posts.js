Posts = new Mongo.Collection('posts');

Posts.allow({
	insert: function(userId, doc) {
		//Allow only for registered users
		return !!userId;
	}
})