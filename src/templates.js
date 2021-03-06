wellDefine('Plugins:Sawbones:Templates', function (app) {
	this.exports(function () {
			//template api
			function create (opts) {
				return {
					path: opts.path,
					html: opts.html,
					render: function (data) {
						return opts.renderer(data)
					}
				}
			}

			// constructor
			var Controller = function () {
				this.storage = {};
				this.config = {};
				this.defaults = {};
				this._start();
			};

			//controllers api
			_.extend(Controller.prototype, {
				configure: function (opts) {
					this.config = opts;
					return this;
				},

				_start: function () {
					if (app.isProduction)
						this._processCompiled();
					return this;
				},

				get: function (name) {
					return this.storage[name];
				},

				exist: function (name) {
					return !!this.storage[name];
				},

				registerPartial: function (opts) {
					if (!opts.html && !opts.templateName)
						return console.log('error: ', 'no html');

					if (app.isProduction)
						Handlebars.partials[opts.partialName] = Handlebars.templates[app.transformToPath(opts.templateName)];
					else
						Handlebars.registerPartial(opts.partialName || opts.templateName, opts.html || this.get(opts.templateName).html);
				},

				isNotFound: function (name) {
					return (name.indexOf('NotFound') !== -1 || name.indexOf('not-found') !== -1);
				},

				load: function (files, next, options) {
					options = options || {};
					if (_.isString(files))
						files = [files];
					var missing = _.filter(files, function (file) {
						return !this.exist(file) && !this.exist(options.prefix + file);
					}, this);

					var defs = [];
					_.each(missing, function (file, index) {
						defs.push(
							this.getAjax(file, options)
						);
					}, this);
					$.when.apply($, defs).then(
							_.isFunction(next) && next
					);
				},

				//from html
				getAjax: function (file, options) {
					var path = (options.root || this.config.root || '/') + app.transformToPath(file);
					return $.ajax({
						url: path + '.html',
						dataType: 'html',
						context: this,
						success: function (html) {
							var template = create({
								path: path,
								renderer: Handlebars.compile(html),
								html: html
							});
							this.storage[(options.prefix || '') + file] = template;
						},
						error: function (res) {
							console.error(res);
						}
					})
				},

				//from precompiled
				_processCompiled: function () {
					var templates = Handlebars.templates;
					for(var path in templates) {
						if (!templates.hasOwnProperty(path)) continue;
						this.storage[app.transformToName(path)] = create({
							path: path,
							renderer: templates[path]
						});
					}
					return this;
				}
			});
			return new Controller();
		}
	);
});