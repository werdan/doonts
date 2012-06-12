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
	
	it('checks role object in view when role exists (no advice in url)', function () {
		
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

            var role = res.render.mostRecentCall.args[1].role;

            expect(res.render.mostRecentCall.args[1].role.advices[0].text).toEqual("Best advice ever");
			expect(res.render.mostRecentCall.args[1].role.advices[0].nextFacebookInfoUpdateTime).toEqual(123123123);
            expect(res.render.mostRecentCall.args[1].og['type']).toEqual('article');
            expect(res.render.mostRecentCall.args[1].og['url']).toEqual(role.href);
            expect(res.render.mostRecentCall.args[1].og['title']).toEqual("Advice for @" + role.name);
            expect(res.render.mostRecentCall.args[1].og['image']).toContain('logofb');
		});
	});

    it('checks role object in view when role exists (advice with no media/plain text)', function () {

        var routes = app.match.get('/role/view/144/test?advice=12785');
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

            var role = res.render.mostRecentCall.args[1].role;

            expect(res.render.mostRecentCall.args[1].role.advices[0].text).toEqual("Best advice ever");
            expect(res.render.mostRecentCall.args[1].role.advices[0].nextFacebookInfoUpdateTime).toEqual(123123123);
            expect(res.render.mostRecentCall.args[1].og['type']).toEqual('article');
            expect(res.render.mostRecentCall.args[1].og['url']).toEqual(role.href);
            expect(res.render.mostRecentCall.args[1].og['title']).toEqual("Advice for @" + role.name);
            expect(res.render.mostRecentCall.args[1].og['image']).toContain('logofb');
        });
    });

    it('checks role object in view when role exists (with Video advice)', function () {

        var routes = app.match.get('/role/view/145/test?advice=12786');
        var callback = routes[0].callbacks[1];

        var req = {params: {roleUID: 145}, query: {advice: 12786}};

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
            expect(res.render.mostRecentCall.args[1].role.uid).toEqual(145);

            var role = res.render.mostRecentCall.args[1].role;

            expect(res.render.mostRecentCall.args[1].role.advices[0].nextFacebookInfoUpdateTime).toEqual(123123123);
            expect(res.render.mostRecentCall.args[1].og['url']).toEqual(role.href + "?advice=12786");
            expect(res.render.mostRecentCall.args[1].og['title']).toEqual("Advice for @" + role.name);
            expect(res.render.mostRecentCall.args[1].og['video']).toEqual('http://titleindbyoutube.com');
            expect(res.render.mostRecentCall.args[1].og['description']).toEqual(role.advices[0].text);
            expect(res.render.mostRecentCall.args[1].og['image:width']).toEqual('120');
            expect(res.render.mostRecentCall.args[1].og['image']).toEqual('http://somesomesome-youtube.jpg');
        });
    });

    it('checks role object in view when role exists (with Amazon media in advice)', function () {

        var routes = app.match.get('/role/view/145/test?advice=12787');
        var callback = routes[0].callbacks[1];

        var req = {params: {roleUID: 146}, query: {advice: 12787}};

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
            expect(res.render.mostRecentCall.args[1].role.uid).toEqual(146);

            var role = res.render.mostRecentCall.args[1].role;

            expect(res.render.mostRecentCall.args[1].role.advices[0].nextFacebookInfoUpdateTime).toEqual(123123123);
            expect(res.render.mostRecentCall.args[1].og['url']).toEqual(role.href + "?advice=12787");
            expect(res.render.mostRecentCall.args[1].og['title']).toEqual("Advice for @" + role.name);
            expect(res.render.mostRecentCall.args[1].og['type']).toEqual('book');
            expect(res.render.mostRecentCall.args[1].og['description']).toEqual(role.advices[0].text);
            expect(res.render.mostRecentCall.args[1].og['image']).toEqual('http://somesomesome.jpg');
        });
    });


    it('test role creation when no role name is given', function () {
        var routes = app.match.post('/role/create');
        var callback = routes[0].callbacks[0];

        var req = {body: {key : 'f7cc3e62e0a3c33b1af77768665adf'}};

        var res = function() {};
        res.redirect = function() {};
        spyOn(res, 'redirect');

        callback(req, res, null);
        waitsFor(function(){return res.redirect.wasCalled;} ,'res.redirect() is never called',1000);
        runs(function () {
            expect(res.redirect.mostRecentCall.args[0]).toEqual('/');
        });
    });

    it('test role creation with unique name, when user is not logged-in', function () {
        var routes = app.match.post('/role/create');
        var callback = routes[0].callbacks[0];

        var req = {body: {roleName: 'test role', key : '4f754920ea791c5bb6198429e27e5b30ddf07f1c'}};

        var res = function() {};
        res.redirect = function() {};
        spyOn(res, 'redirect');

        callback(req, res, null);
        waitsFor(function(){return res.redirect.wasCalled;} ,'res.redirect() is never called',1000);
        runs(function () {
            var latch = false;
            done = function() {
                return latch;
            };
            expect(res.redirect.mostRecentCall.args[0]).not.toContain('/role/view/144');
            expect(res.redirect.mostRecentCall.args[0]).toContain('/role/view');
            Role.findOne({name:"test role"},function(err,role){
                expect(role.timestampCreated).toBeGreaterThan(Date.now()-1000);
                expect(role.uid).toBeDefined();
                expect(role.uid).toBeGreaterThan(10);
                latch = true;
            });
            waitsFor(done, "Role.find is not called");
        });
    });

    it('test role creation with unique name, user is logged-iin', function () {
        var routes = app.match.post('/role/create');
        var callback = routes[0].callbacks[0];

        var req = {body: {roleName: 'test role', key : '4f754920ea791c5bb6198429e27e5b30ddf07f1c'}, session: {userId: 123123123}};

        var res = function() {};
        res.redirect = function() {};
        spyOn(res, 'redirect');

        callback(req, res, null);
        waitsFor(function(){return res.redirect.wasCalled;} ,'res.redirect() is never called',1000);
        runs(function () {
            var latch = false;
            done = function() {
                return latch;
            };
            expect(res.redirect.mostRecentCall.args[0]).not.toContain('/role/view/144');
            expect(res.redirect.mostRecentCall.args[0]).toContain('/role/view');
            Role.findOne({name:"test role"}).
                populate('author').
                run(function(err,role){
                    expect(role.timestampCreated).toBeGreaterThan(Date.now()-1000);
                    expect(role.author.uid).toEqual('123123123');
                    latch = true;
                });
            waitsFor(done, "Role.find is not called");
        });
    });

    it('test role creation with a name that already exists in db', function () {
        var routes = app.match.post('/role/create');
        var callback = routes[0].callbacks[0];

        var req = {body: {roleName: 'Project manager with spaces', key: 'cd0821d35320b6783c21d9a61c0f39a8465a5252'}};

        var res = function() {};
        res.redirect = function() {};
        spyOn(res, 'redirect');

        callback(req, res, null);
        waitsFor(function(){return res.redirect.wasCalled;} ,'res.redirect() is never called',1000);
        runs(function () {
            expect(res.redirect.mostRecentCall.args[0]).toContain('/role/view/144');
        });
    });

    it('test role creation with empty secretKey', function () {
        var routes = app.match.post('/role/create');
        var callback = routes[0].callbacks[0];

        var req = {body: {roleName: 'test role'}};

        var res = function() {};
        res.redirect = function() {};
        spyOn(res, 'redirect');

        callback(req, res, null);
        waitsFor(function(){return res.redirect.wasCalled;} ,'res.redirect() is never called',1000);
        runs(function () {
            expect(res.redirect.mostRecentCall.args[0]).toContain('/search?q=test role');
        });
    });

    it('test role creation with incorrect secretKey', function () {
        var routes = app.match.post('/role/create');
        var callback = routes[0].callbacks[0];

        var req = {body: {roleName: 'test role', key: 'incorrect'}};

        var res = function() {};
        res.redirect = function() {};
        spyOn(res, 'redirect');

        callback(req, res, null);
        waitsFor(function(){return res.redirect.wasCalled;} ,'res.redirect() is never called',1000);
        runs(function () {
            expect(res.redirect.mostRecentCall.args[0]).toContain('/search?q=test role');
        });
    });
});