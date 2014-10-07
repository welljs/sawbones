module.exports = function (app) {
	var gulp = app.gulp;
	var _ = app._;
	gulp.task('buildWell', function () {
		function seq (arr) {
			return _.map(arr, function (file) {
				return app.wellRoot + 'src/' + file + '.js';
			});
		}
		gulp.src(seq(['utils', 'events', 'module', 'queue', 'modules', 'main']))
			.pipe(app.concat('well.js'))
			.pipe(app.wrap("(function(){\n\t 'use strict'; \n <%= contents%>  \n})();"))
			.pipe(gulp.dest(app.wellRoot));
	});
};