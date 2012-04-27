"use strict";

var fixtures = require('mongoose-fixtures');


describe('myaccount controller', function(){

	it('checks that loginbox renders Login button if user is not logged-in', function () {
		var routes = app.match.get('/myaccount/loginbox');
		var callback = routes[0].callbacks[0];

		var req = {query: {redirectUri: '/test/test'}};

		var res = function() {};
        res.render = function() {};
        spyOn(res, 'render');

		callback(req, res, null);

		waitsFor(function(){return res.render.wasCalled;},'res.render() is never called',1000);
		runs(function () {
			expect(res.render).toHaveBeenCalled();
			var template = res.render.mostRecentCall.args[0];
			var vars = res.render.mostRecentCall.args[1];
			expect(template).toMatch('login.ejs');
			expect(vars.redirectUri).toEqual('%2Ftest%2Ftest');
		});
	});

    it('checks that loginbox renders User name if user is logged-in', function () {
        var routes = app.match.get('/myaccount/loginbox');
        var callback = routes[0].callbacks[0];

        var req = {session: {userId: 123}, query: {redirectUri: '/test/test'}};

        var res = function() {};
        res.render = function() {};
        spyOn(res, 'render');

        callback(req, res, null);

        waitsFor(function(){return res.render.wasCalled;},'res.render() is never called',1000);
        runs(function () {
            expect(res.render).toHaveBeenCalled();
            var template = res.render.mostRecentCall.args[0];
            expect(template).toMatch('hello.ejs');
            var vars = res.render.mostRecentCall.args[1];
            expect(vars.redirectUri).toEqual('%2Ftest%2Ftest');

        });
    });

    it('checks that myaccount/login saves URL from redirectUri param to session', function () {
        var routes = app.match.get('/myaccount/login');
        var callback = routes[0].callbacks[0];

        var req = {session: {}, originalUrl: '/myaccount/login?redirectUri=%2Ftest%2Ftest',query: {redirectUri: "%2Ftest%2Ftest"}};
        var res = function() {};
        res.redirect = function() {};
        spyOn(res, 'redirect');

        var next = jasmine.createSpy('next');

        callback(req, res, next);

        waitsFor(function(){return next.wasCalled;},'next() is never called',1000);
        runs(function () {
            expect(next).toHaveBeenCalled();
            expect(req.session.redirectUri).toEqual('/test/test');
        });
    });

    it('checks that myaccount/login redirects to home page after FBAuth if there is no redirectUri in session', function () {
        var routes = app.match.get('/myaccount/login');
        var callback = routes[0].callbacks[2];

        var req = {session: {}};
        var res = function() {};
        res.redirect = function() {};
        spyOn(res, 'redirect');

        var next = jasmine.createSpy('next');

        callback(req, res, next);

        waitsFor(function(){return res.redirect.wasCalled;},'res.redirect() is never called',1000);
        runs(function () {
            expect(res.redirect).toHaveBeenCalled();
            var redirectUri = res.redirect.mostRecentCall.args[0];
            expect(redirectUri).toEqual('/');
        });
    });

    it('checks that myaccount/login redirects to saved URI after FBAuth', function () {
        var routes = app.match.get('/myaccount/login');
        var callback = routes[0].callbacks[2];

        var req = {session: {redirectUri: "/test/test"}};
        var res = function() {};
        res.redirect = function() {};
        spyOn(res, 'redirect');

        var next = jasmine.createSpy('next');

        callback(req, res, next);

        waitsFor(function(){return res.redirect.wasCalled;},'res.redirect() is never called',1000);
        runs(function () {
            expect(res.redirect).toHaveBeenCalled();
            var redirectUri = res.redirect.mostRecentCall.args[0];
            expect(redirectUri).toEqual('/test/test');
        });
    });

    it('checks that myaccount/logout redirects to saved URI and clears session', function () {
        var routes = app.match.get('/myaccount/logout');
        var callback = routes[0].callbacks[1];

        var req = {session: {redirectUri: "/test/test", userId : 123123123}};
        var res = function() {};
        res.redirect = function() {};
        spyOn(res, 'redirect');

        callback(req, res, null);

        waitsFor(function(){return res.redirect.wasCalled;},'res.redirect() is never called',1000);
        runs(function () {
            expect(req.session.userId).toBeFalsy();
            expect(res.redirect).toHaveBeenCalled();
            var redirectUri = res.redirect.mostRecentCall.args[0];
            expect(redirectUri).toEqual('/test/test');
        });
    });


});
