var fs 		= require('fs');
var path	= require('path');

//	Require all gulp tasks
//
fs.readdirSync('./gulp/tasks/').filter(function(f) {
	return path.extname(f) === ".js"
}).forEach(function(task) {
	require('./tasks/' + task)
});