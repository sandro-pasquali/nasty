var gulp 	= require('gulp');
var fs		= require('fs');
var path	= require('path');
var mkdirp	= require('mkdirp');

var $args	= require('../build.json'); 

gulp.task('init', function(cb) {

	fs.writeFileSync("./compass.rb", "http_path = './'\ncss_dir = '" + $args.buildDirectory + "/css'\nsass_dir = '" + $args.sourceDirectory + "/sass'\nimages_dir = '" + $args.buildDirectory + "/media/images'\nrelative_assets = true\nline_comments = true\noutput_style = :compressed");

	fs.exists($args.buildDirectory, function(yes) {
		if(yes) {
			return cb();
		}
		
		mkdirp.sync($args.traceurDirectory);
		mkdirp.sync($args.buildDirectory);
		cb();
	})
});

