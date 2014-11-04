wellDefine('Plugins:Sawbones:Main', function (app) {
	this.use(':Views', {autoInit: false});
	this.use(':Templates', {autoInit: false});
	this.use(':Collections', {autoInit: false});
	this.use(':Models', {autoInit: false});
	this.use(':Router', {autoInit: false});
	this.use(':PageView', {autoInit: false});
	this.exports(function(){
		app.Events = _.extend(Backbone.Events, {});
		app.Templates = new this.Templates();
		app.PageProto = new this.PageView();
		app.Views = new this.Views();
		app.Router = this.Router();
		app.Models = new this.Models();
		app.Collections = new this.Collections();
	});
});
