wellDefine('Plugins:Sawbones:Main', function (app) {
	this.use(':Views');
	this.use(':Templates');
	this.use(':Collections');
	this.use(':Models');
	this.use(':Router');
	this.exports(function(){
		app.Events = _.extend(Backbone.Events, {});
		app.Templates = new(app.Modules.get('Plugins:Sawbones:Templates'));
		app.Views = new(app.Modules.get('Plugins:Sawbones:Views'));
		app.Router = new(app.Modules.get('Plugins:Sawbones:Router')());
		app.Models = new(app.Modules.get('Plugins:Sawbones:Models'));
		app.Collections = new(app.Modules.get('Plugins:Sawbones:Collections'));
	});
});
