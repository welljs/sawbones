wellDefine('Strategy', function (app, undefined) {
	this.use('Vendor:JqueryWell', {autoInit: true});
	this.use('Vendor:UnderscoreWell');
	this.use('Vendor:BackboneWell');
	this.use('Vendor:HandlebarsWell');
	this.use('Vendor:HighlightPackWell');
	this.use('Plugins:Sawbones:Main');
	this.use('Utils:HandlebarsHelpers');
	this.use('Utils:Helpers');
	this.exports(function () {
		var WellSite = function () {
			this.init();
			this.configure();
			this.start();
		};
		WellSite.prototype.init = function () {
			var Modules = app.Modules;
			//global Helpers
			app.Helpers = new(Modules.get('Utils:Helpers'));
			//initializing Handlebars helpers
			new (Modules.get('Utils:HandlebarsHelpers'));
			return this;
		};

		WellSite.prototype.configure = function () {
			app.Router.configure({
				actions: {
					'/': 'Views:Pages:Overview',
					'/installation': 'Views:Pages:Installation',
					'/features': {
						page: 'Views:Pages:Features',
						layout: 'Views:Layouts:Main'
					},
					'/docs': {
						page: 'Views:Pages:Docs'
					}
				},
				//backbone router rules
				routes: [
					/^[A-Za-z0-9\/_-]{0,24}$/
				]
			});

			app.Views.configure({
				notFoundModule: 'Views:Pages:NotFound',
				layoutHolder: '#site-container',
				layoutModule: 'Views:Layouts:Main'
			});

			app.Templates.configure({
				root:'/app/templates/'
			});

			return this;
		};

		WellSite.prototype.start = function () {

			$('body').on('click', 'a[href^="/"]', function (e) {
				e.preventDefault();
				app.Router.go($(this).attr('href'), {trigger: true});
			});

			$(document).ready(function () {
				app.Router.start({pushState: true});
			})
		};
		return new WellSite();
	});
});
