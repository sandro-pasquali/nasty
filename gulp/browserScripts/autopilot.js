window.nasty = new function() {

	Promise.longStackTraces();

	var _this			= this;
	var views 			= {};
	var lastYearsModel 	= null;
	
	Backbone.$ = $;

	var THROW_IF_NO_MODEL = function(meth) {
		if(!lastYearsModel) {
			throw new Error("No active view for #" +  meth + ". Use #addView or #open first");
		}
	}

	//	##addView
	//
	this.addView = function(id, config) {

		config.initialize = function() {
			this.render();
		};

		//	Render view into all tags with tagName == view.id.
		//	e.g. <body><index></index> <-- 'index' view id injects into these.
		//	Note as well that multiple tags == multiple identical views.
		//
		config.render = function() {
			$(id).html(this.template(views[id].Binding.attributes));
		}

		lastYearsModel = views[id] = {
			id			: id,
			View 		: Backbone.View.extend(config),
			Binding		: new (Backbone.Model.extend({}))
		}
		
		//	Extend with event bindings, which map to #nasty.on, 
		//	#nasty.off, #nasty.trigger, and custom.
		//
		_.extend(views[id], Backbone.Events);
		
		//	Notify any general listeners when the model has changed, and re-render.
		//
		views[id].Binding.on('change', function(chob) {
		
			views[id].trigger('change', chob);
			
			new views[id].View({});
		});
		
		return this
	}
	
	//	##open
	//
	this.open = function(id) {
		lastYearsModel = !id ? lastYearsModel : views[id] || false;
		return this
	}	
	
	//	##get
	//
	this.get = function(key) {
		
		return new Promise(function(resolve, reject) {
		
			THROW_IF_NO_MODEL('get');

			resolve(lastYearsModel.Binding.get(key));
		})
	}
	
	//	##set
	//
	this.set = function(obj, value) {
	
		return new Promise(function(resolve, reject) {
	
			var key;
	
			THROW_IF_NO_MODEL('set');
			
			if(typeof obj !== "object") {
				if(typeof value !== undefined) {
					key = obj;
					obj = {};
					obj[key] = value;
				} else {
					throw new Error("Must send an map of key/value pairs to #set(obj), or individual arguments (key, value)");
				}
			}
			
			resolve(lastYearsModel.Binding.set(obj))
		})
	}
	
	//	##del
	//
	this.del = function(keys) {
		
		return new Promise(function(resolve, reject) {
		
			THROW_IF_NO_MODEL('del');
			
			if(!keys) {
				throw new Error("No key sent to #del.");
			}
			
			if(!_.isArray(keys)) {
				keys = [keys];
			}
			
			var id = lastYearsModel.id;
			
			var keyLen	= keys.length -1;
			var olds	= new Array(keyLen);
			
			keys.forEach(function(key, idx) {
				olds.push(views[id].Binding.get(key))
				views[id].Binding.unset(key, {
					//	Do not broadcast change until set of actions is complete
					//
					silent : idx !== keyLen ? true : false
				});
			});
			
			resolve(olds)
		})
	}
	
	//	##on
	//
	this.on = function(event, func) {

		THROW_IF_NO_MODEL('on');
		
		lastYearsModel.on(event, func);
		
		return this
	}
	
	//	##off
	//
	this.off = function(event, func, ctxt) {

		THROW_IF_NO_MODEL('off');
		
		lastYearsModel.off(event, func, ctxt);
		
		return this
	}
	
	//	##trigger
	//
	this.trigger = function(event, args) {

		THROW_IF_NO_MODEL('trigger');

		lastYearsModel.trigger(event);
		
		return this
	}
	
	//	Provide helper methods that handle the control flow of multiple array #get(key)
	//	calls for users for some _ functions. Other _ functions should be
	//	handled by the user (get(key) -> _.method(key value));
	//
	"union intersection difference zip".split(" ")
	.forEach(function(ex) {
		_this[ex] = function() {
		
			var keys = Array.prototype.slice.call(arguments);	
		
			return new Promise(function(resolve, reject) {

				//	For each key map its getter (which itself returns a Promise)
				//
				Promise.all(keys.map(function(key) {
					return _this.get(key)
				}))
				.then(function(results) {
					//	Results must each be arrays.
					//
					if(_.every(results, _.isArray)) {				
						return resolve(_[ex].apply(_, results));
					}
					
					reject(ex + ' passed non-arrays against keys -> ' + keys.toString());
				})
				.caught(function(err) {
					reject(ex + ' -> at least one #get threw an error: ' + err);
				})
			})
		}
	})	
};
