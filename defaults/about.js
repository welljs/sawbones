//страница по-умолчанию, если приложение не создано или не найдено
wellDefine('Plugins:Sawbones:Defaults:About', function () {
	this.set({
		template: ':About',
		type: 'view',
		isDefault: true
	});
	this.exports(function () {
		return Backbone.View.extend({
			initialize: function () {

			},
			render: function () {
				this.$el.html(this.template.render());
			}
		});
	});
});
