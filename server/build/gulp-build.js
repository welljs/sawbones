module.exports = function (app, opts) {
	var gulp = app.gulp;
	gulp.task('build', function () {
		var dir = app.sawbonesRoot;
		gulp.src(dir + '*.js')
			.pipe(app.concat('sawbones.min.js'))
			.pipe(app.uglify())
			.pipe(gulp.dest('../../'))
	});
};

