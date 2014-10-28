'use strict';
var handlebars = require('handlebars');
var fs = require('fs');

module.exports = function () {
	var T = function (options) {
		var options = options || {};
		this.root = options.root;
		this.storage = {};
	};

	T.prototype.get = function (name, next) {
		var file = this.root + '/pages/' + name + '.html';
		var self = this;
		var template = this.storage[name];
		if (template)
			return next(null, template);
		fs.readFile(file, {encoding: 'utf-8'}, function (err, data) {
			return err
				? next(err.message)
				: next(null, (self.storage[name] = handlebars.compile(data)));
		});
	};

	return T;
};