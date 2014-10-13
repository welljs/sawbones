wellDefine('Plugins:Sawbones:Router', function (app) {
	this.exports(function () {
		return Backbone.Router.extend({
			currentPage: null,
			initialize: function (options) {
				this.config = {};
			},

			defineRoutes: function (routes) {
				var router = this;
				//Backbone routes
				_.each(routes, function (route) {
					this.route(route, 'proxy');
				}, this);
				Backbone.history.handlers.push({
					route: /(.*)/,
					callback: function () {
						router.go('/');
						return this;
					}
				});
				return this;
			},

			proxy: function () {
				var params = Array.prototype.slice.call(arguments);
				var action = this.parseUrl(Backbone.history.fragment, params);
				this.currentPage = action;
				app.Events.trigger('ROUTER_PAGE_CHANGED', this.getRouteAction(action), {route: action, params: params});
				this.customLayout = null;
			},

			go: function (url, options) {
				if (options)
					this.customLayout = options.layout;
				Backbone.history.navigate(url, {trigger: true});
			},

			configure: function (config) {
				this.config = config;
				this.config.pushState = config.pushState || false;
				this.defineRoutes(config.routes);
				this.beforeStart = config.beforeStart || function(){};
				return this;
			},

			start: function () {
				_.isFunction(this.beforeStart) && this.beforeStart();
				Backbone.history.start({pushState: this.config.pushState});
			},

			getRouteAction: function (route) {
				var action = this.config.actions[route];

				if (!this.customLayout)
					return action;

				return _.isObject(action)
					? (action['layout'] = this.customLayout)
					: {
					page: action,
					layout: this.customLayout
				}
			},

			parseUrl: function (fragment,  params) {
				var args = fragment.split('/');
				return args[0] ? '/' + args[0] : '/';
			}
		});
	});
});
