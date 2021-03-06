wellDefine('Plugins:Sawbones:Router', function (app) {
	this.exports(function () {
		return new (Backbone.Router.extend({
			currentPage: null,
			initialize: function (options) {
				this.config = {
					defaultPage: '/'
				};
			},

			defineRoutes: function (routes) {
				var router = this;
				this.route(/(.*)/, function () {
					router.go('/');
					return this;
				});
				_.each(routes, function (route) {
					this.route(route, 'proxy');
				}, this);
				return this;
			},

			proxy: function () {
				var params = Array.prototype.slice.call(arguments);
				var action = this.parseUrl(Backbone.history.fragment, params);
				var self = this;
				this.accessPage(action, params, function (err, url) {
					if (err)
						return self.go(url || self.currentPage || self.config.defaultPage);

					self.currentPage = action;
					app.Events.trigger('ROUTER_PAGE_CHANGED', self.getRouteAction(action), {route: action, params: params});
					self.customLayout = null;
				});
			},

			accessPage: function (action, params, next) {
				next();
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
		}))();
	});
});
