var fixtures = require('mongoose-fixtures');

describe('Home controller', function(){
	
    beforeEach(function () {

        var latch = false;
        done = function() {
            return latch;
        };

        fixtures.load(__dirname + '/../../fixtures/controllers/home.js', function() {
            latch = true;
        });
        
        waitsFor(done,"Before each init is timeouted",1000);
    });
    
    it('checks home page load', function () {
        var routes = app.match.get('/');
        var callback = routes[0].callbacks[1];
        
        var req = {};
        
        var res = function() {};
        res.render = function() {};
        spyOn(res, 'render');
        waits(500);
        runs(function(){
            callback(req, res, null);
            
            waitsFor(function(){return res.render.wasCalled;},'res.render() is never called',1000);
            runs(function () {
                var rolesRendered = res.render.mostRecentCall.args[1].roles;
                var authorsWithKeys = res.render.mostRecentCall.args[1].authors;
                expect(rolesRendered.length).toBeGreaterThan(1);
                expect(parseInt(rolesRendered[0].topAdvice.uid)).toEqual(12785);
                expect(parseInt(rolesRendered[0].topAdvice.uid)).toEqual(12785);
                expect(authorsWithKeys[rolesRendered[0].topAdvice.author]).toBeDefined();
            });
        });
    });

    it('tests seo footer middleware: seoFooterDataAppender', function () {
        var routes = app.match.get('/');
        var callback = routes[0].callbacks[0];

        var next = jasmine.createSpy('next');

        runs(function(){
            callback(null, null, next);

            waitsFor(function(){return next.wasCalled;},'next() is never called',1000);
            runs(function () {
                var viewOptions = app.set("view options");
                expect(viewOptions.seoRoles.length).toBeGreaterThan(1);
            });
        });
    });
});