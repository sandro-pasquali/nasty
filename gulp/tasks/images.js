var gulp       	= require('gulp');
var changed    	= require('gulp-changed');
var imagemin   	= require('gulp-imagemin');
var notify		= require('../util/notify');
var $args		= require('../build.json');

gulp.task('images', ['init'], function() {
	var dest = $args.buildDirectory + '/media/images';

	return gulp.src($args.sourceDirectory + '/media/images/**')
		.pipe(changed(dest)) 
		.pipe(imagemin()) 
		.pipe(gulp.dest(dest))
		.on('error', notify.error)
});
