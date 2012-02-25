var fixtures = require('mongoose-fixtures');
var Advice = db.model("Advice");
var Role = db.model("Role");

describe('advice controller', function(){
	
	beforeEach(function () {
			var latch = false;
			done = function() {
				return latch;
			};
	        fixtures.load(__dirname + '/../../fixtures/controllers/advice.js', function() {
	            latch = true;
	        });
			waitsFor(done,"Before each init is timeouted",1000);
	});
	
	it('checks like/unlike event handler - when adviceId isn\'t correct', function () {
		var routes = app.match.post('/advice/like/12783');
		var callback = routes[0].callbacks[0];
		
		var req = {params: [undefined,'1111nosuchadvice222']};
		
		var next = jasmine.createSpy('next');

		callback(req, null, next);
		
		waitsFor(function(){return next.wasCalled;},'next() is never called',1000);
		runs(function () {
			expect(next).toHaveBeenCalledWith(new Error());
		});
	});
	
    it('checks like event handler - for correct adviceId', function () {
        var latch = false;
        done = function() {
            return latch;
        };

        Advice.findByUID(12785, function(err, advice){
            if (!err) {
                 expect(parseInt(advice.facebookLikes)).toEqual(12);
                latch = true;
            }
        });

        waitsFor(function() {return done();}, 'Advice is not updated', 1000);
        runs(function(){
            var routes = app.match.post('/advice/like/12785');
            var callback = routes[0].callbacks[0];
            
            var req = {params: [undefined,12785]};
            
            var res = {};
            
            res.render = jasmine.createSpy('res');
            callback(req, res, null);
            
            waitsFor(function(){return res.render.wasCalled;},'res.redirect() is never called',1000);
            runs(function () {
                latch = false;
                expect(res.render).toHaveBeenCalledWith('empty.ejs');
                Advice.findByUID(12785, function(err, advice){
                    if (!err) {
                        expect(parseInt(advice.facebookLikes)).toEqual(13);
                        expect(advice.nextFacebookInfoUpdateTime).toEqual(0);
                        advice.getRole(function(err, role){
                            expect(parseInt(role.totalFacebookLikes)).toEqual(15);
                            latch = true;
                        });
                    }
                });
                waitsFor(function() {return done();}, 'Advice is not updated', 1000);
            });
        });
    });
    
    it('checks unlike event handler - for correct adviceId', function () {
        var latch = false;
        done = function() {
            return latch;
        };
        
        Advice.findByUID(12785, function(err, advice){
            if (!err) {
                expect(parseInt(advice.facebookLikes)).toEqual(12);
                latch = true;
            }
        });
        
        waitsFor(function() {return done();}, 'Advice is not updated', 1000);
        runs(function(){
            var routes = app.match.post('/advice/unlike/12785');
            var callback = routes[0].callbacks[0];
            
            var req = {params: ['un',12785]};
            
            var res = {};
            
            res.render = jasmine.createSpy('res');
            
            callback(req, res, null);

            waitsFor(function(){return res.render.wasCalled;},'res.redirect() is never called',1000);
            runs(function () {
                expect(res.render).toHaveBeenCalledWith('empty.ejs');
                Advice.findByUID(12785, function(err, advice){
                    if (!err) {
                        expect(parseInt(advice.facebookLikes)).toEqual(11);
                        expect(advice.nextFacebookInfoUpdateTime).toEqual(0);
                        latch = true;
                    }
                });
                waitsFor(function() {return done();}, 'Advice is not updated', 1000);
            });
        });
    });
});