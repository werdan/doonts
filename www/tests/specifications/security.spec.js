var secureRequest = require("../../lib/security.js").secureRequest;

describe('Security functions', function(){
	
	it('Checks secureRequest: not-logged-in user is required to auth', function () {
		
		var req;
		var next = jasmine.createSpy('next');
		var authManager = jasmine.createSpy('authManager');
		
		app.set("authManager", authManager);
		
		secureRequest(req,null,next);
		
		waitsFor(function(){return next.wasCalled;},'next() is never called',1000);
		runs(function () {
			expect(next).toHaveBeenCalled();
		});
	});
	
});