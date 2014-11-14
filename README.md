__Sawbones__ - это плагин для фреймоврка [Welljs](https://github.com/welljs/welljs) который позволяет быстро развернуть Backbone-приложение

Так выглядит обыкновенный модуль стратегии использующий Sawbones:

```javascript
wellDefine('Strategy', function (app, undefined) {
	this.use('Vendor:Jquery');
	this.use('Vendor:Underscore');
	this.use('Vendor:Backbone');
	this.use('Vendor:Handlebars');
	this.use('Vendor:HighlightPack');
	this.use('Plugins:Sawbones:Main', {as: 'Sawbones'});
	this.use('Utils:HandlebarsHelpers', {as: 'HH'});
	this.use('Utils:Helpers');
	this.exports(function () {
		var WellSite = function () {
			this.init();
			this.configure();
			this.start();
		};
		WellSite.prototype.init = function () {
			//global Helpers
			new this.Helpers();
			//initializing Handlebars helpers
			new this.HH();
			return this;
		};

		WellSite.prototype.configure = function () {
			// После инициализации плагина появляются глобальные объекты-контроллеры: 
			// Router, Views, Templates, Models, Collections, PageView

			//Конфигурация роутера
			app.Router.configure({
				actions: {
					'/': 'Views:Pages:Overview',
					'/installation': 'Views:Pages:Installation',
					'/features': {
						page: 'Views:Pages:Features',
						//можно указывать layout
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
```
