var http = require('http');
var express = require('express');
var path = require('path');
var app = express();
var TemplateManager = require('./template-manager')();
require('./handlebars-helpers')();


app.use(require('body-parser')());
app.use(require('method-override')());


module.exports = function () {
	var Server = function (options) {
		this.options = options || {};
		this.init();
		this.create();
		this.handleRequests();
	};

	Server.prototype.init = function () {
		var env = this.env = this.options.production ? 'production' : 'development';
		this.appRoot = path.join(__dirname, '../apps/' + this.options.name + '/' + env + '/');
		this.templateManager = new TemplateManager({
			root: this.appRoot + this.options.templatesRoot
		});
		return this;
	};

	Server.prototype.create = function () {
		var port = this.options.port;
		var env = this.env;
		app.use(express.static(this.appRoot, {hidden : true}));
		app.set('port', port);
		http.createServer(app).listen(app.get('port'), '127.0.0.1', function(){
			console.log('Express server listening on port ' + port);
			console.log('current environment: ', env);
		});
		return this;
	};

	Server.prototype.handleRequests = function () {
		var self = this;
		var routes = this.options.routes;
		app.get('/*', function (req, res, next) {
			var doc = routes[req.originalUrl];
			if (!doc)
				return self.send404(res);

			self.templateManager.get(doc, function (err, template) {
				return err || !template
					? self.sendError(res, {errNo: 500, msg: err || 'Render template problem'})
					: self.sendOk(res, template());
			});

		});
	};

	Server.prototype.send404 = function (res) {
		this.sendError(res, {errNo: 404, msg: 'Page not found'});
	};

	Server.prototype.sendError = function (res, data) {
		res.send(data.errNo || 500, data.msg || 'server error');
	};

	Server.prototype.sendOk = function (res, data) {
		res.send(200, data);
	};

	return Server;
};