var gulp 	= require('gulp');
var review	= require('review');
var notify 	= require('../util/notify');
var $args	= require('../build.json'); 

gulp.task('default', ['server'], function(cb) {

	var devServerPort 	= $args.devServerPort || 3000;
	var testServerPort	= $args.testServerPort || 4000;

	//	Visual testing
	//
	review()
		.title('Responsiveness Test')
		.sites({ localhost : 'http://localhost:' + devServerPort })
		.resolutions([
			'2560X1440', 
			'1280X800', 
			'1024X768', // iPad, iPad2, iPad Mini
			'768x1024',
			'2048x1536', // iPad Retina
			'1536x2048',
			'1136x640', // iPhone5, Touch
			'640x1136',
			'960x640', // iPhone4
			'640x936',
			'480x320', // iPhone, iPhone3
			'320x480'
			
		])
		.cache({
			dir : __dirname + '/cache/',
			expires : 60
		})
		.listen(testServerPort)
		
	cb()
});