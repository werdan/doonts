var Role = db.model("Role");

describe('role controller', function(){
	
	beforeEach(function () {
			var latch = false;
			done = function() {
				return latch;
			};
			Role.remove(function() {
				Role.create({ uid: 144, 
					name: "Project manager",
					advices: [{text: "Best advice ever"}]}, function(){
						latch = true;
					});
			});
			waitsFor(done,"Before each init is timeouted",1000);
	});
	
	it('checks what if role does not exists', function () {
		var routes = app.match.get('/role/123/test');
		var callback = routes[0].callbacks[0];
		
		var req = {params: {roleUID: 112}};
		
		var next = jasmine.createSpy('next');

		callback(req, null, next);
		
		waitsFor(function(){return next.wasCalled;},'next() is never called',1000);
		runs(function () {
			expect(next).toHaveBeenCalled();
		});
	});
	
	it('checks role object in view when role exists', function () {
		
		var routes = app.match.get('/role/144/test');
		var callback = routes[0].callbacks[0];
		
		var req = {params: {roleUID: 144}};

		var res = function() {};
		res.render = function() {};
		spyOn(res, 'render');

		var next = jasmine.createSpy('next').andCallFake(function(err){
			console.log(err);
		});
		
		next.isCalled = function() {
			return next.wasCalled;
		};
		
		callback(req, res, next);
		waitsFor(function(){return res.render.wasCalled;} ,'res.render() is never called',1000);
		runs(function () {
			expect(next).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalled();
			expect(res.render.mostRecentCall.args[1].role.uid).toEqual(144);
			//TODO: this is strange, why can not I just use value without parsing to Int?
			expect(res.render.mostRecentCall.args[1].role.advices[0].text).toEqual("Best advice ever");
		});
	});
	
	it('checks that role can be updated', function () {
		var routes = app.match.post('/role/update/144');
		var callback = routes[0].callbacks[0];
		
		var testName = "My new role text";
		
		var req = {params: {name: testName, roleUID: 144}};
		
		var next = jasmine.createSpy('next').andCallFake(function(err){
			console.log(err);
		});

		var res = function() {};
		res.redirect = function() {};
		spyOn(res, 'redirect');

		Role.findByUID(144, function(err, role) {
			expect(role.name).not.toEqual(testName);
		});
		
		console.log("Req.params=" + req.params.name);
		callback(req, res, next);
		
		waitsFor(function(){return res.redirect.wasCalled;},'next() is never called',1000);

		var latch = false;
		done = function() {
			return latch;
		};
		
		runs(function () {
			expect(next).not.toHaveBeenCalled();
			expect(res.redirect).toHaveBeenCalled();
			Role.findByUID(144, function(err, role) {
				expect(role.name).toEqual(testName);
				latch = true;
			});
		});
		waitsFor(done,'Done is not called',1000);
	});
	
	it('checks role creation', function () {
		var routes = app.match.get('/role/create');
		var callback = routes[0].callbacks[0];
		var req = {params: {roleUID: 144}};

		var res = function() {};
		res.render = function() {};
		spyOn(res, 'render');

		var next = jasmine.createSpy('next').andCallFake(function(err){
			console.log(err);
		});
		
		next.isCalled = function() {
			return next.wasCalled;
		};
		
		callback(req, res, next);
		waitsFor(function(){return res.render.wasCalled;} ,'res.render() is never called',1000);
	});
});