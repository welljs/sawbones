__Sawbone__ - это плагин для фреймоврка [Welljs](https://github.com/welljs/welljs) который позволяет быстро развернуть Backbone-приложение

Так выглядит обыкновенный модуль стратегии:

```javascript
wellDefine('Strategy', function (app, undefined) {
  this.use('Vendor:JqueryWell');
  this.use('Vendor:UnderscoreWell');
  this.use('Vendor:BackboneWell');
  this.use('Vendor:HandlebarsWell');
  this.use('Plugins:Sawbones:Main');
  this.exports(function(){
    var Strategy = function(){
      this.init();
      this.configure();
    };
    Strategy.prototype.init = function(){
      var Modules = app.Modules;
      //initializing globals jQuery($), Backbone, _ (underscore) and Handlebars
      Modules.get('Vendor:JqueryWell')();
      Modules.get('Vendor:UnderscoreWell')();
      Modules.get('Vendor:BackboneWell')();
      Modules.get('Vendor:HandlebarsWell')();
      //initializing plugin
      Modules.get('Plugins:Sawbones:Main')();
      //after Sawbones initializing in app-namespace will appear Router, Views, 
      //Templates, Collections, Models and Events objects with theirs API
      return this;
    }
    Strategy.prototype.configure = function () {
      //configuring router
      app.Router.configure({
        actions: {
          '/': 'Views:Pages:Home',
          '/about': 'Views:Pages:About',
          '/docs':  'Views:Pages:Docs',
          // also it's possible to specify layout, if it differs from main. 
          // For example Landing page
          '/features': {
            page: 'Views:Pages:Features',
            layout: 'Views:Layouts:Landing'
          },
        },
        //backbone router rules. By default pattern to comply with RFC 3987 
        routes: [
          /^[A-Za-z0-9\/_-]{0,24}$/
        ]
      });

      app.Views.configure({
        notFoundModule: 'Views:Pages:NotFound',
        layoutHolder: '#site-container',
        layoutModule: 'Views:Layouts:Main',
        //relative to this dir will be calculated templates path and names
        templates: '/app/templates/'
      });

      $(document).ready(function () {
        app.Router.start();
      });
      
    }
    return new Strategy();
  });
});
```
