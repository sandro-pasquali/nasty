var notify = require("gulp-notify");

module.exports = {

	error : function(error) {

		var args = Array.prototype.slice.call(arguments);
	
		var message = error.message.match(/error\u001b\[0m\s?(.*)\s\(Line(.*)/);
		
		if(!message) {
			return this.emit('end');
		}
		
		var filename = message[1];
		
		//	Replace object message with parsed version.
		//
		error.message = message[2];
		
		var msgObj = {
			title: "Compile Error",
			message: "<%= error.message %>"
		};
		
		if(filename) {
			msgObj.subtitle = filename;
		}
		
		notify.onError(msgObj).apply(this, args);
	
		//	Force task end.
		//
		this.emit('end');
	},
	
	ok : function() {
		notify({
			message: "Build completed successfully"
		})
	}
};