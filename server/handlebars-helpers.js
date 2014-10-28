module.exports = function () {
	var Handlebars = require('handlebars');
	Handlebars.registerHelper('url', function (route) {
		if (route === '/')
			route = '';
		return '/' + route;
	});
	Handlebars.registerHelper('copyright', function () {
		return '©' + new Date().getFullYear();
	});
};