wellDefine('Views:Pages:NotFound', function (app) {
	this.use('Views:Common:Page');
	this.set({
		template: 'Pages:NotFound'
	});
	this.exports(function () {
		return app.Views.get('Views:Common:Page').extend({});
	});
});