wellDefine('Plugins:Sawbones:PageView', function (app) {
	this.exports(function () {
		return Backbone.View.extend({
			setTemplate: function (name) {
				this.template = app.Templates.get(name);
			},
			requestData: function (next) {
				next();
			},
			render: function () {
				this.$el.html(this.template.render());
			},
			onPageLeave: function () {}
		});
	});
});