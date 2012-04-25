var fixtures = require('mongoose-fixtures');

var solrClientFactory = require('../../../lib/solrClientFactory.js');

describe('search controller', function(){
	
	beforeEach(function () {
			var latch = false;
			done = function() {
				return latch;
			};
            fixtures.load(__dirname + '/../../fixtures/controllers/search.js', function() {
                var solrClient = solrClientFactory.getClient();
                solrClient.commit(function(){
                    latch = true;
                });
            });
			waitsFor(done,"Before each init is timeouted",10000);
	});

    it('tests search for role that does not exists', function () {
        var routes = app.match.get('/search');
        var callback = routes[0].callbacks[1];

        var req = {query: {q: 'not existent quelquechose'}};

        var res = {};
        res.render = jasmine.createSpy('render');

        callback(req, res, null);

        waitsFor(function(){return res.render.wasCalled;},'res.render() is never called',10000);
        runs(function () {
            var passedParams = res.render.mostRecentCall.args[1];
            var needsVirtualRole = res.render.mostRecentCall.args[2];
            expect(parseInt(passedParams['roles'].length)).toEqual(0);
            expect(passedParams['needsVirtualRole']).toBeTruthy();
        });
    });

    it('tests search for multiwords in role names', function () {
        var routes = app.match.get('/search');
        var callback = routes[0].callbacks[1];

        var req = {query: {q: 'doctor of biology'}};

        var res = {};
        res.render = jasmine.createSpy('render');

        callback(req, res, null);

        waitsFor(function(){return res.render.wasCalled;},'res.render() is never called',10000);
        runs(function () {
            var passedParams = res.render.mostRecentCall.args[1];
            var needsVirtualRole = res.render.mostRecentCall.args[2];
            expect(parseInt(passedParams['roles'].length)).toEqual(4);
            expect(passedParams['needsVirtualRole']).toBeTruthy();
        });
    });

    it('tests search for role with exact name that already exists', function () {
        var routes = app.match.get('/search');
        var callback = routes[0].callbacks[1];

        var req = {query: {q: 'Doctor professor in biology'}};

        var res = {};
        res.render = jasmine.createSpy('render');

        callback(req, res, null);

        waitsFor(function(){return res.render.wasCalled;},'res.render() is never called',10000);
        runs(function () {
            var passedParams = res.render.mostRecentCall.args[1];
            var needsVirtualRole = res.render.mostRecentCall.args[2];
            expect(parseInt(passedParams['roles'].length)).toEqual(4);
            expect(passedParams['needsVirtualRole']).toBeFalsy();
        });
    });
});