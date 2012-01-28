
describe('Security manager test', function(){
	
	it('Checks requireAuth: isLoggedIn == true && needsAuthInfoUpdate == false', function () {
		var fb = require("../../tests/stubs/facebook-api-stub");
		var securityManager = require("../../lib/securityManager.js")(fb);
		
		var req = {
				session: {
					userId: 123,
					authInfoExpires: Date.now()+10
				}
		};

		var next = jasmine.createSpy('next');
		spyOn(securityManager,'requireAuth').andCallThrough();

		securityManager.requireAuth(req,null,next);
		
		waitsFor(function(){return next.wasCalled;},'next() is never called',1000);
		runs(function(){
			expect(next).toHaveBeenCalled();
		});
	});

	
	it('Checks requireAuth: isLoggedIn == false && isValidFacebookReturnCode == false', function () {
		var fb = require("../../tests/stubs/facebook-api-stub");
		var securityManager = require("../../lib/securityManager.js")(fb);
		
		var req = {
				query: {
					code: "lkuipiaglk1408gl1014"
				},
				url : "/test/url"
		};

		var res = {redirect: function() {}};
		spyOn(res, 'redirect');
		
		securityManager.requireAuth(req,res,null);
		
		waitsFor(function(){return res.redirect.wasCalled;},'res.redirect() never called',1000);
		runs(function(){
			expect(res.redirect).toHaveBeenCalledWith("/login");
		});
	});

	it('Checks requireAuth: isLoggedIn == false && isValidFacebookReturnCode == true', function () {
		var fb = require("../../tests/stubs/facebook-api-stub");
		var securityManager = require("../../lib/securityManager.js")(fb);
		
		var req = {
				query: {
					code: "lkuipiag123123123lk1408gl1014"
				},
				session: {},
				url : "/test/url"
		};

		var next = jasmine.createSpy("next");
		
		securityManager.requireAuth(req,null,next);
		
		waitsFor(function(){return next.wasCalled;},'next() never called',1000);
		//User is logged in
		//next() is called
		runs(function(){
			expect(next).toHaveBeenCalled();
			console.log(req);
			expect(req.session.userId).toBeDefined();
		});
	});

	
});