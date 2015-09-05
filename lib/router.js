Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function() {
		return [Meteor.subscribe('posts'), Meteor.subscribe('comments')]
	}
});

Router.map(function(){
	this.route('postsList', {path:'/'});

	this.route('postPage', {
		path: '/posts/:_id',
		data: function() {return Posts.findOne(this.params._id);}
	});
	this.route('postEdit', {
		path: '/posts/:_id/edit',
		data: function() { return Posts.findOne(this.params._id);}
	})
	this.route('postSubmit',{path: '/submit'});
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