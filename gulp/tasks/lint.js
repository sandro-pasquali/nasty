var gulp 	= require('gulp');
var jshint	= require('gulp-jshint');
var changed = require('gulp-changed');
var notify 	= require('../util/notify');
var $args	= require('../build.json'); 

var dest = $args.buildDirectory + '/js';

gulp.task('lint', ['init','traceur'], function() {
	return gulp.src([
		$args.traceurDirectory + '/*', 
		$args.sourceDirectory + '/js/*', 
		$args.testDirectory + '/*'])
			.pipe(changed(dest))
			.pipe(jshint('./.jshintrc'))
			.pipe(jshint.reporter('default'))
});