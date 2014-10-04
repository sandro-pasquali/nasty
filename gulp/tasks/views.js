var gulp 	= require('gulp');
var replace	= require('gulp-replace');
var fs		= require('fs');
var path	= require('path');
var notify 	= require('../util/notify');
var $args	= require('../build.json'); 

//	Move html views (/views directory) into build directory.
//
//	Replace script token on page layouts w/ browserify bundle.
//	Bundled CSS is simply inserted before </head>
//	Then move everything over to the build directory.
//
gulp.task('views', ['init', 'traceur'], function() {

	return gulp.src($args.sourceDirectory + '/views/**')
		.pipe(replace('<!-- @bundle -->', '<script src="/application.js"></script>'))
		.pipe(replace('</head>', '<link rel="stylesheet" href="/css/application.css" />\n</head>'))
		.pipe(replace(/\<\!-- @test(.*)--\>/g, function(match) {
			
			var script = match.match(/\<\!-- @test(.*)--\>/)[1]

			if(typeof script !== "string") {
				return;
			}
			
			script = script.trim();

			return '<script src="' + script + '"></script>';
		}))
		.pipe(gulp.dest($args.buildDirectory + '/html'))
		.on('error', notify.error)
		
});

