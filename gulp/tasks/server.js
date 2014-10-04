var browserSync = require('browser-sync');
var review 		= require('review');
var gulp        = require('gulp');
var fs			= require('fs');
var path		= require('path');
var $args		= require('../build.json');

gulp.task('server', ['test'], function(cb) {
					
	var devServerPort 	= $args.devServerPort || 3000;
	var testServerPort	= $args.testServerPort || 4000;

	Object.keys($args.watching).forEach(function(path) {
		gulp.watch(path, $args.watching[path]);
	});
	
	browserSync.init([$args.buildDirectory + '/**'], {
		notify: false,
		injectChanges: true,
		port: devServerPort,
		server: {
			//	Two base dirs:
			//	$buildDirectory is understood as http-public root. In our view (html)
			//	pages, /css/foo.css will map to /build/css/foo.css.
			//	
			//	The server OTOH, when fetching views (html) needs to look in the /build/html
			//	folder, initially for index.html -- not the basedir itself.
			//
			baseDir: [$args.buildDirectory, $args.buildDirectory + '/html']
		}
	});
	
	cb()

});

