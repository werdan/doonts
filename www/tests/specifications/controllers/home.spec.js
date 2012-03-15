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
        var callback = routes[0].callbacks[0];
        
        var req = {};
        
        var res = function() {};
        res.render = function() {};
        spyOn(res, 'render');
        waits(500);
        runs(function(){
            callback(req, res, null);
            
            waitsFor(function(){return res.render.wasCalled;},'res.render() is never called',1000);
            runs(function () {
                expect(res.render.mostRecentCall.args[1].roles.length).toBeGreaterThan(1);
            });
        });
    });

});