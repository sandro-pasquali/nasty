var compass	= require('gulp-compass');
var gulp	= require('gulp');
var notify 	= require('../util/notify');
var $args	= require('../build.json');

gulp.task('compass', ['init'], function(cb) {
	gulp.src($args.sourceDirectory + '/sass/*.sass')
		.pipe(compass({
			config_file	: $args.compassConfig,
			css			: $args.buildDirectory + '/css',
			sass		: $args.sourceDirectory + '/sass'
		}))
		.on('error', notify.error);
		
	cb()
});
