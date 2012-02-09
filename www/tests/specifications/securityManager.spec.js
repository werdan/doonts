var User = db.model("User");
var LogEvent = db.model("LogEvent");

describe('Security manager test, several cases:', function(){
	
	beforeEach(function () {
		var latch = false;
		var latch2 = false;
		done = function() {
			return latch && latch2;
		};
		User.remove(function() {
			User.create({ uid: 100002043624653, 
						  first_name: "Andriy",
						  last_name: "Samilyak"
						}, 
						function(){
							latch = true;
						});
		});
		LogEvent.remove(function(){
		    latch2 = true;
		});
		waitsFor(done,"Before each init is timeouted",1000);
	});
	
	it('checks requireAuth: isLoggedIn == true && needsAuthInfoUpdate == false', function () {
		var fb = require("../../tests/stubs/facebook-api-stub");
		var securityManager = require("../../lib/securityManager.js")(fb);
		
		var req = {
				session: {
					userId: 100002043624653,
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

	
	it('checks requireAuth: isLoggedIn == false && isValidFacebookReturnCode == false && userDeniedApplication == false', function () {
		var fb = require("../../tests/stubs/facebook-api-stub");
		var securityManager = require("../../lib/securityManager.js")(fb);
		
		var req = {
				query: {
					code: "lkuipiag12312",
					error_reason: "user_denied",
					error: "access_denied"
				},
				url : "/test/url"
		};

		var res = {redirect: function() {}};
		spyOn(res, 'redirect');
		
		securityManager.requireAuth(req,res,null);
		
		waitsFor(function(){return res.redirect.wasCalled;},'res.redirect() never called',1000);
		runs(function(){
			expect(res.redirect).toHaveBeenCalled();
		});
		
		req = {
				query: {
				},
				url : "/facebook?error=user_denied"
		};

		res = {redirect: function() {}};
		spyOn(res, 'redirect');
		
		securityManager.requireAuth(req,res,null);
		
		waitsFor(function(){return res.redirect.wasCalled;},'res.redirect() never called',1000);
		runs(function(){
			expect(res.redirect).toHaveBeenCalled();
		});
	});

	it('checks requireAuth: isLoggedIn == false && isValidFacebookReturnCode == true && userDeniedApplication == false', function () {
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
			expect(req.session.userId).toBeDefined();
			expect(req.session.authInfoExpires).toBeGreaterThan(Date.now() + app.set("web.authInfoTTL")-1000);
		});
	});
	
	it('checks requireAuth: isLoggedIn == true && isValidFacebookReturnCode == true && userDeniedApplication == true', function () {
        var fb = require("../../tests/stubs/facebook-api-stub");
        var securityManager = require("../../lib/securityManager.js")(fb);
        
        var req = {
                query: {
                    code: "completelyokfacebookcodelength",
                    error_reason: "user_denied",
                    error: "access_denied"
                },
                session: {
                    userId: 100002043624653,
                    authInfoExpires: Date.now()-100
                },
                url : "/test/url"
        };

        var next = jasmine.createSpy("next");
        
        securityManager.requireAuth(req,null,next);
        
        waitsFor(function(){return next.wasCalled;},'next() never called',1000);
        runs(function(){
            expect(next).toHaveBeenCalledWith(new Error());
            
            var latch = false;
            done = function() {
                return latch;
            };
            LogEvent.find({}, function(err,logs){
                expect(logs.length).toEqual(1);
                latch = true;
            });
            waitsFor(function(){return done();},'done() never called',1000);
        });
    });

	   it('checks requireAuth: isLoggedIn == false && isValidFacebookReturnCode == true && userDeniedApplication == true', function () {
	        var fb = require("../../tests/stubs/facebook-api-stub");
	        var securityManager = require("../../lib/securityManager.js")(fb);
	        
	        var req = {
	                query: {
	                    code: "completelyokfacebookcodelength",
	                    error_reason: "user_denied",
	                    error: "access_denied"
	                },
	                session: {},
	                url : "/test/url"
	        };

	        var next = jasmine.createSpy("next");
	        
	        securityManager.requireAuth(req,null,next);
	        
	        waitsFor(function(){return next.wasCalled;},'next() never called',1000);
	        runs(function(){
	            expect(next).toHaveBeenCalledWith(new Error());
	            
	            var latch = false;
	            done = function() {
	                return latch;
	            };
	            LogEvent.find({}, function(err,logs){
	                expect(logs.length).toEqual(1);
	                latch = true;
	            });
	            waitsFor(function(){return done();},'done() never called',1000);
	        });
	    });

	
	it('checks requireAuth: isLoggedIn == true && needsAuthInfoUpdate == true && isValidFacebookReturnCode == true', function () {
		var fb = require("../../tests/stubs/facebook-api-stub");
		var securityManager = require("../../lib/securityManager.js")(fb);
		
		var req = {
				query: {
					code: "lkuipiag123123123lk1408gl1014dfdfdf"
				},
				session: {
					userId: 100002043624653,
					//Expired authInfo
					authInfoExpires: Date.now()-10
				},
				url : "/test/url"
		};
		var next = jasmine.createSpy("next");
		
		var latch = false;
		done = function() {
			return latch;
		};

		
		//ID and info set in facebook-api-stub.js
		User.findByUID("100002043624653", function(err, user) {
			user.first_name = "Andrii";
			user.save(function(err){
				latch = true;
			});
		});
		
		waitsFor(function(){return done();},'done() never called',1000);
		runs(function(){
			securityManager.requireAuth(req,null,next);
			
			waitsFor(function(){return next.wasCalled;},'next() never called',1000);
			runs(function(){
				latch = false;
				var updatedUser = {};
				User.findByUID("100002043624653", function(err, user) {
					updatedUser = user;
					latch = true;
				});
				
				waitsFor(function(){return done();},'next() never called',1000);
				
				//User is logged in
				//next() is called
				runs(function(){
					expect(updatedUser.first_name).toEqual("Andriy");
					expect(req.session.authInfoExpires).toBeGreaterThan(Date.now() + app.set("web.authInfoTTL")-1000);
				});
			});
		});
	});
	
	it("checks requiredAuth: isLoggedIn == true && needsAuthInfoUpdate == true && isValidFacebookReturnCode == false  && userDeniedApplication == true", function(){
		var fb = require("../../tests/stubs/facebook-api-stub");
		var securityManager = require("../../lib/securityManager.js")(fb);
		
		var req = {
				query: {
				    error_reason: "user_denied",
				    error: "access_denied"
				},
				session: {
					userId: 100002043624653,
					//Expired authInfo
					authInfoExpires: Date.now()-100,
				},
				originalUrl : "/test/url",
				url : "/test/url"
		};
		
		res = {redirect: function() {}};
		spyOn(res, 'redirect');
		
		var next = jasmine.createSpy("next");
		securityManager.requireAuth(req,res,next);
		
		waitsFor(function(){return res.redirect.wasCalled;},'res.redirect() never called',1000);
		runs(function(){
			expect(res.redirect).toHaveBeenCalledWith("/facebook?error=user_denied");
		});
	});	
	
    it("checks requiredAuth: isLoggedIn == true && needsAuthInfoUpdate == true && isValidFacebookReturnCode == false  && userDeniedApplication == false", function(){
        var fb = require("../../tests/stubs/facebook-api-stub");
        var securityManager = require("../../lib/securityManager.js")(fb);
        
        var req = {
                query: {
                },
                session: {
                    userId: 100002043624653,
                    //Expired authInfo
                    authInfoExpires: Date.now()-100,
                },
                originalUrl : "/test/url",
                url : "/test/url"
        };
        
        res = {redirect: function() {}};
        spyOn(res, 'redirect');
        
        var next = jasmine.createSpy("next");
        securityManager.requireAuth(req,res,next);
        
        waitsFor(function(){return res.redirect.wasCalled;},'res.redirect() never called',1000);
        runs(function(){
            expect(res.redirect.argsForCall[0][0].indexOf("facebook") != -1).toBeTruthy();
            expect(res.redirect.argsForCall[0][0].indexOf("/test/url") != -1).toBeTruthy();
        });
    });
});