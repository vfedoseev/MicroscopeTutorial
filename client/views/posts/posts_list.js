var postsData = [
	{
		title: 'Introducing Telscope',
		url: 'http://sachagreif.com/introducing-telescope/'
	},
	{
		title: 'Meteor',
		url: 'http://meteor.com'
	},
	{
		title: 'The Meteor Book',
		url: 'http://themeteorbook.com'
	}
];

Template.postsList.helpers({
	/*posts: function() {
		return Posts.find({},{sort: {submitted: -1}});
	}*/
	postsWithRank: function() {
		this.posts.rewind();
		return this.posts.map(function(post,index, cursor) {
			post._rank = index;
			return post;
		});
	}
});