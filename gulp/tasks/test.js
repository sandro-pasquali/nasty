var gulp 			= require('gulp');
var mochaPhantomJS 	= require('gulp-mocha-phantomjs');
var replace			= require('gulp-replace');
var fs				= require('fs');
var path			= require('path');
var notify 			= require('../util/notify');
var $args			= require('../build.json'); 

gulp.task('test', ['init','traceur','images','compass','browserify','images','views'], function(cb) {

	//	Find all the page files, add testing harness (mocha, chai, phantom), add in the 
	//	test file (the js that will be tested)
	//
	gulp.src($args.sourceDirectory + '/views/**')
		.pipe(replace(/\<\/head>/, '<link rel="stylesheet" href="../../node_modules/mocha/mocha.css" />\n</head>'))
		.pipe(replace(/\<\!-- @test(.*)--\>/g, function(match) {
			
			var script = match.match(/\<\!-- @test(.*)--\>/)[1]

			if(typeof script !== "string") {
				return;
			}
			
			script = script.trim();
			
			//	Set a flag for test kit to be inserted (mocha, chai), which is done below.
			//	Fetch the test target script from /build
			//
			var ret = '<!-- @runnerScript --><script src="../../build' + script + '"></script><script>';
			
			//	Fetch the test script to match this source script, and insert it
			//	directly into the page.
			//
			var cont = fs.readFileSync(path.join($args.testDirectory,path.basename(script)));
			
			if(!cont) {
				throw new Error('View asked for nonexistent test script -> ' + script)
			}

			ret += cont + '</script><script>\
				if(window.mochaPhantomJS) {\
					mochaPhantomJS.run();\
				} else {\
					mocha.run();\
				}\
				 </script>';
			
			return ret;
		}))
		
		//	Replace this flag with the relevant test kit.
		//	Note that this regex will only match the first test runner, ie. we'll
		//	only be including mocha etc once, not on each test insert.
		//
		.pipe(replace(/\<\!-- @runnerScript --\>/, '<div id="mocha"></div><script src="../../node_modules/mocha/mocha.js"></script><script src="../../node_modules/chai/chai.js"></script><script>mocha.setup("bdd")</script>'))
		
		.pipe(replace('<!-- @bundle -->', '<script src="../../build/application.js"></script><script>\
				nasty.set = nasty.get = nasty.del = function() {};</script>'))
		
		//	Once created move the test html files into test/views/
		//
		.pipe(gulp.dest('./test/views'))

	
		//	Now execute those views via mochaPhantom. This runs the tests.
		//
		return gulp
			.src('./test/views/*')
			.pipe(mochaPhantomJS())
});