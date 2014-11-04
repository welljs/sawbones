//если в пользовательском приложении лэйаут не указан, будет использоваться этот
wellDefine('Plugins:Sawbones:Defaults:Layout', function () {
	this.set({
		type: 'view',
		template: ':Layout',
		isDefault: true
	});
	this.exports(function () {
		return Backbone.View.extend({
			initialize: function () {
			},

			render: function () {
				this.$el.html(this.template.render());
				this.pageContainer = this.$('.main');
			}
		});
	});
});
