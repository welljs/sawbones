__Sawbones__ - это плагин для фреймоврка [Welljs](https://github.com/welljs/welljs) который позволяет быстро развернуть Backbone-приложение

Так выглядит обыкновенный модуль стратегии использующий Sawbones:

```javascript
wellDefine('Strategy', function (app, undefined) {
	this.use('Vendor:JqueryWell', true);
	this.use('Vendor:UnderscoreWell', true);
	this.use('Vendor:BackboneWell', true);
	this.use('Vendor:HandlebarsWell', true);
	this.use('Vendor:HighlightPackWell', true);
	this.use('Plugins:Sawbones:Main', true);
	this.use('Utils:HandlebarsHelpers', true);
	this.use('Utils:Helpers', true);
	this.exports(function () {
		var WellSite = function () {
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
				root: '/app/templates/'
			});
			
			$(document).ready(function () {
				app.Router.start();
			})
		};
		return new WellSite();
	});
});
```
