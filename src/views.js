wellDefine('Plugins:Sawbones:Views', function (app) {
	this.exports(function(){
		var Controller = function () {
			app.Events.on('ROUTER_PAGE_CHANGED', this.tryToRender, this);
			app.on('MODULE_DEFINED', this.onModuleDefined, this);
		};
		
		_.extend(Controller.prototype, {
			//initialized views
			initialized: {},
			//view modules
			modules: {},
			config: {},
			currentLayout: null,
			currentPage: null,
			configure: function (options) {
				this.config = options;
			},

			get: function (viewName) {
				return app.Modules.getModule(viewName).exportsFn();
			},

			getModule: function (viewName) {
				return app.Modules.getModule(viewName);
			},

			getConfigParam: function (name) {
				return this.config[name];
			},

			getPartials: function (module) {
				if (module) {
					var mod = _.isString(module) ? this.getModule(module) : module;
					return mod.get('partials') || [];
				}
			},

			getTemplate: function (module) {
				if (module) {
					var mod = _.isString(module) ? this.getModule(module) : module;
					var name = mod.get('template');
					return app.Templates.get(name) || name;
				}
			},

			onModuleDefined: function (module) {
				if (this.isView(module))
					this.complete(module);
			},

			isView: function (module) {
				return module.get('type') === 'view' || module.name.indexOf('View') !== -1;
			},


			isCurrentLayout: function (viewName) {
				return !!(this.currentLayout && this.currentLayout.name === viewName);
			},

			complete: function (module) {
				function terminate(){
					module.isComplete = true;
					app.Events.trigger('MODULE_COMPLETED', module);
				}

				if (app.isProduction)
					return terminate();

				var templates = [];
				var template = this.getTemplate(module);
				if (template)
					templates.push(module.get('template'));

				_.each(this.getPartials(module), function (partial) {
					templates.push(partial);
				}, this);

				if (_.isEmpty(templates))
					return terminate();

				//если есть шаблоны, то заргужаются
				else {
					app.Templates.load(templates, function () {
						return terminate();
					});
				}
			},

			getIncomplete: function (modules) {
				var res = [];
				_.each(modules, function (mod) {
					if (!mod.isComplete)
						res.push(mod.name);
				});
				return res;
			},

			waitOnQueueComplete: function (modules, next) {
				var incomplete = this.getIncomplete(modules);
				if (_.isEmpty(incomplete)) return next.call(this);
				app.Events.on('MODULE_COMPLETED', function (module) {
					var index = incomplete.indexOf(module.name);
					//проверка на то, из текущей ли очереди загружен модуль
					if (index !== -1) {
						incomplete.splice(index, 1);
						if (!incomplete.length) {
							app.Events.off('MODULE_COMPLETED');
							return next.call(this)
						}
					}
				}, this);
			},

			tryToRender: function (action, params) {
				var page, layout, self = this, o, layoutName, pageName;
				this.showOverlay();
				if (_.isString(action)) {
					layoutName = this.getConfigParam('layoutModule') || ':Defaults:Layout';
					pageName = action;
				}
				//не определена рутером
				else if (!action) {
					layoutName = this.getConfigParam('layoutModule') || ':Defaults:Layout';
					pageName = this.getConfigParam('notFoundModule') || ':Defaults:NotFound';
				}
				else if (!action.page && action.layout) {
					layoutName = action.layout
					pageName = this.getConfigParam('notFoundModule') || ':Defaults:NotFound';
				}
				else {
					layoutName = action.layout || this.getConfigParam('layoutModule') || ':Defaults:Layout';
					pageName = action.page;
				}

				layout = this.getModule(layoutName);
				//загрузка лэйаута
				if (!layout) {
					return app.require([layoutName], function (err, modules) {
						self.waitOnQueueComplete(modules, function () {
							self.tryToRender(action, params);
						});
					});
				}
				//если лэйаут загружен, но не загружены его зависимости, то ожидание всех зависимостей
				else if (!layout.isComplete) {
					(o = {})[layout.name] = layout;
					return this.waitOnQueueComplete(o, function () {
						self.tryToRender(action, params);
					});
				}

				page = this.getModule(pageName);
				if (!page) {
					return app.require([pageName], function (err, modules) {
						self.waitOnQueueComplete(modules, function () {
							self.tryToRender(action, params);
						});
					}, function () {
						if (!self.getModule('Well:Defaults:NotFound')) {
							return app.require(['Well:Defaults:NotFound'], function (err, modules) {
								self.waitOnQueueComplete(modules, function () {
									self.tryToRender('Well:Defaults:NotFound', params);
								});
							});
						}
						app.Router.go('not-found');
					});
				}
				//если страница загружена, но не загружены её зависимости, то ожидание всех зависимостей
				else if (!page.isComplete) {
					(o = {})[page.name] = page;
					return this.waitOnQueueComplete(o, function () {
						self.tryToRender(action, params);
					});
				}

				if (this.currentPage)
					app.Events.trigger('PAGE_LEAVE', this.currentPage.view);
				//когда загружены все данные, можно отрендерить лэйаут и страницу
				app.Events.trigger('BEFORE_PAGE_RENDERED', {page: page, layout: layout, params: params.params});
				this.renderLayout.apply(this, [layout, params.params]);

				var pageView = this.getInitialized(page);
				pageView.requestData(function() {
					self.renderPage.apply(self, [page, params.params]);
					self.hideOverlay();
					app.Events.trigger('PAGE_RENDERED', {page: page, layout: layout, params: params.params});
				});
				return this;
			},

			renderPage: function (module, params) {
				this.currentPage = module;
				module.el = this.currentLayout.view.pageContainer;
				return this.currentPage.view = this._render(module, params);
			},

			renderLayout: function (module, params) {
				if (this.isCurrentLayout(module.name))
					return this.currentLayout.view;
				this.currentLayout = module;
				module.el = $(this.config.layoutHolder || 'body');
				return this.currentLayout.view = this._render(module, params);
			},

			_render: function (module, params) {
				var view = this.getInitialized(module);
				if (_.isFunction(view.render)) {
					view.render(params);
				}
				return view;
			},

			getInitialized: function (module) {
				var view = this.initialized[module.name] || this.initialize(module);
				view.$el = module.el;
				return view;
			},

			initialize: function (requiredMod, options) {
				var module = _.isString(requiredMod)
					? this.getModule(requiredMod)
					: requiredMod;
				if (!module)
					throw 'View module ' + requiredMod +' not found';

				var template = this.getTemplate(module);
				var viewName = module.name;
				var view = this.initialized[viewName] = new (this.get(viewName))(_.extend({
					template: template,
					el: module.el
				}, options));
				view.template = template;
				view.module = module;
				return view;
			},

			showOverlay: function () {
				this.isOverlayVisible = true;
			},

			hideOverlay: function () {
				this.isOverlayVisible = false;
			}

		});
		return new Controller();
	});
});
