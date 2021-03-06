wellDefine('Views:Pages:Docs', function (app) {
	this.use('Views:Common:Page');
	this.use('Views:Partials:DocsSidebar');
	this.set({
		template: 'Pages:Docs'
	});
	this.exports(function () {
		return app.Views.get('Views:Common:Page').extend({
			render: function () {
				this.sidebar = app.Views.initialize('Views:Partials:DocsSidebar', {
					el: this.$('docs-sidebar')
				});
				this.$el.html(this.template.render());
				return this;
			}
		});
	});
});