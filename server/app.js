var Server = require('./server')();

var server = new Server({
	name: 'ProjectExample',
	port: 3002,
	templatesRoot: 'app/templates',
	routes: {
		'/docs': 'docs',
		'/overview':'overview'
	}
//	production: true
});
