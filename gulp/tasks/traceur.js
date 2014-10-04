var gulp 	= require('gulp');
var traceur	= require('gulp-traceur');
var notify 	= require('../util/notify');
var $args	= require('../build.json'); 

gulp.task('traceur', ['init'], function(cb) {

	gulp.src([$args.sourceDirectory + '/components/*.js'])
		.pipe(traceur())
		.pipe(gulp.dest($args.traceurDirectory))
		
	return gulp.src([$args.sourceDirectory + '/js/*'])
		.pipe(traceur())
		.pipe(gulp.dest($args.buildDirectory + '/js'))
});