Template.postSubmit.events({
	'submit form': function(e) {
		e.preventDefault();

		var post = {
			url: $(e.target).find('[name=url]').val(),
			title: $(e.target).find('[name=title]').val()
		};
		Meteor.call('postInsert', post, function(error, id) {
			if(error) {
				Errors.throw(error.reason);
				if(error.error === 302)
					Router.go('postPage', {_id: error.details});
			}
			else {
				Router.go('postPage', {_id: id});
			}
		});
	}
});