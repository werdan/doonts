var fixtures = require('mongoose-fixtures');
var Role = db.model("Role");
var Advice = db.model("Advice");

describe('role controller', function(){
	
	beforeEach(function () {
			var latch = false;
			done = function() {
				return latch;
			};
            fixtures.load(__dirname + '/../../fixtures/controllers/role.js', function() {
                latch = true;
            });
			waitsFor(done,"Before each init is timeouted",1000);
	});
	
	it('checks what if role does not exists', function () {
		var routes = app.match.get('/role/view/123/test');
		var callback = routes[0].callbacks[1];
		
		var req = {params: {roleUID: 112}};
		
		var next = jasmine.createSpy('next');

		callback(req, null, next);
		
		waitsFor(function(){return next.wasCalled;},'next() is never called',1000);
		runs(function () {
			expect(next).toHaveBeenCalled();
		});
	});
	
	it('checks role object in view when role exists', function () {
		
		var routes = app.match.get('/role/view/144/test');
		var callback = routes[0].callbacks[1];
		
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
			expect(res.render.mostRecentCall.args[1].role.advices[0].text).toEqual("Best advice ever");
			expect(res.render.mostRecentCall.args[1].role.advices[0].nextFacebookInfoUpdateTime).toEqual(123123123);
		});
	});
});