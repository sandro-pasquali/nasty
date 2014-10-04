var watchify    = require('watchify');
var gulp        = require('gulp');
var notify		= require('../util/notify');
var source      = require('vinyl-source-stream');
var buffer 		= require('vinyl-buffer');
var fs			= require('fs');
var path		= require('path');
var exorcist	= require('exorcist');
var uglify		= require('gulp-uglify');
var $args		= require('../build.json');

gulp.task('browserify', ['init', 'traceur', 'lint'], function(cb) {

	//	Note that we re-bundle when these files change
	//
	var bundler = watchify({

		//	The .js files in /components have already been compiled via traceur, and we need
		//	to install those via browserify. These traceur compilations are what we are 
		//	bundling, not the original files.
		//
		entries: fs.readdirSync($args.traceurDirectory).map(function(f) {
			return $args.traceurDirectory + "/" + f;
		}),
		
		//	Browserify only considers '.js' and '.json' files as bundleable.
		//	We want to add handlebars templates, which are processed into the
		//	bundle via package `hbsfy`
		//
		extensions: [".hbs"]
	});

	var bundle = function() {
		
		return bundler
		
			//	No source maps
			//
			.bundle({debug: true})
			
			//	Remove source map from bundle and dump to own file.
			//	browserify bundle will contain something like:
			//	//# sourceMappingURL=application.js.map
			//
			.pipe(exorcist(path.join($args.buildDirectory, $args.bundleFilename + '.map')))
			
			// 	Browserify plugins expect Vinyl file objects.
			//	Convert here.
			//
			.pipe(source($args.bundleFilename))
			
			//	Convert from streaming to buffered Vinyl object
			//
			//.pipe(buffer())
			
			//.pipe(uglify())
			
			//	Target the output folder
			//
			.pipe(gulp.dest($args.buildDirectory))
			
			.on('error', notify.error)
			.on('end', cb)
	};

	//	Whenever files in the bundle change, re-bundle
	//
	bundler.on('update', bundle);

	bundle();
});
