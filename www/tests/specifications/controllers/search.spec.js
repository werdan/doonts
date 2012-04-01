var fixtures = require('mongoose-fixtures');

describe('search controller', function(){
	
	beforeEach(function () {
			var latch = false;
			done = function() {
				return latch;
			};
            fixtures.load(__dirname + '/../../fixtures/controllers/search.js', function() {
                latch = true;
            });
			waitsFor(done,"Before each init is timeouted",1000);
	});
	
	it('checks autocomplete without ?q param', function () {
		var routes = app.match.get('/search/autocomplete');
		var callback = routes[0].callbacks[0];
		
		var req = {query: {}};
		
		var next = jasmine.createSpy('next');

		var res = function() {};
        res.json = function() {};
        spyOn(res, 'json');

		callback(req, res, next);
		
		waitsFor(function(){return res.json.wasCalled;},'res.json() is never called',10000);
		runs(function () {
			expect(res.json).toHaveBeenCalled();
			passedRoles = res.json.mostRecentCall.args[0];
			expect(parseInt(passedRoles.length)).toEqual(0);
		});
	});
	
    it('checks autocomplete WITH ?q param', function () {
	        var routes = app.match.get('/search/autocomplete');
	        var callback = routes[0].callbacks[0];
	        
	        var req = {query: {q: {}}};
	        req.query.q = "cosmo";
	        
	        var next = jasmine.createSpy('next');

	        var res = function() {};
	        res.json = function() {};
	        spyOn(res, 'json');

	        callback(req, res, next);
	        
	        waitsFor(function(){return res.json.wasCalled;},'res.json() is never called',10000);
	        runs(function () {
	            expect(res.json).toHaveBeenCalled();
	            passedRoles = res.json.mostRecentCall.args[0];
	            expect(passedRoles[0].hasOwnProperty('_id')).not.toBeTruthy();
	            expect(parseInt(passedRoles.length)).toEqual(1);
	        });
	 });
});