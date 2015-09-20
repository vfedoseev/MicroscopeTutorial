Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function() {
		return [Meteor.subscribe('notifications')];
	}
});
PostsListController = RouteController.extend({
	template: 'postsList',
	increment: 5,
	limit: function() {
		return parseInt(this.params.postsLimit) || this.increment;
	},
	findOptions: function() {
		return {sort: {submitted: -1}, limit: this.limit()};
	},
	waitOn: function() {
		return Meteor.subscribe('posts', this.findOptions());
	},
	data: function() {
		return {posts: Posts.find({}, this.findOptions())}
	}
});
Router.map(function(){

	this.route('postPage', {
		path: '/posts/:_id',
		waitOn: function() {
			return Meteor.subscribe('comments', this.params._id);
		},
		data: function() {return Posts.findOne(this.params._id);}
	});
	this.route('postEdit', {
		path: '/posts/:_id/edit',
		data: function() { return Posts.findOne(this.params._id);}
	})
	this.route('postSubmit',{path: '/submit'});

	this.route('postsList', {
		path:'/:postsLimit?',
		controller: PostsListController
	});

});

var requireLogin = function() {
	if(! Meteor.user()) {
		if(Meteor.loggingIn()) {
			this.render(this.loadingTemplate);
		} else {
			this.render('accessDenied');	
		}
	}
	else {
		this.next();
	}
}
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
//Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
Router.before(function() {Errors.clearSeen(); this.next();});