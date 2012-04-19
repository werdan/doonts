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

    it('checks that advice/apac action updates advice', function () {
        var latch = false;
        done = function() {
            return latch;
        };

        Advice.findByUID(12785, function(err, advice){
            if (!err) {
                expect(advice.amazon.title).toBeUndefined();
                expect(advice.amazon.url).toBeUndefined();
                expect(advice.amazon.author).toBeUndefined();
                expect(advice.amazon.imgSrc).toBeUndefined();
                latch = true;
            }
        });

        waitsFor(function() {return done();}, 'Advice is not updated', 1000);
        runs(function(){
            var routes = app.match.get('/advice/apac/12785');
            var callback = routes[0].callbacks[0];

            var req = {params: {'adviceUID': 12785}};

            var res = {};

            res.render = jasmine.createSpy('res');

            callback(req, res, null);

            waitsFor(function(){return res.render.wasCalled;},'res.redirect() is never called',1000);

            latch = false;
            runs(function () {
                expect(res.render.mostRecentCall.args[1].resultJson).toContain('Test title');
                expect(res.render.mostRecentCall.args[1].resultJson).toContain('Test author');
                expect(res.render.mostRecentCall.args[1].resultJson).toContain('http');
                expect(res.render.mostRecentCall.args[1].resultJson).toContain('Image');

                Advice.findByUID(12785, function(err, advice){
                    if (!err) {
                        expect(advice.amazon.title).toEqual('Test title');
                        expect(advice.amazon.url).toContain('http');
                        expect(advice.amazon.author).toEqual('Test author');
                        expect(advice.amazon.imgSrc).toContain('Image');
                        latch = true;
                    }
                });
                waitsFor(function() {return done();}, 'Advice is not updated', 1000);
            });
        });
    });

    it('checks that advice/apac does not updates advice when amazon info has been already downloaded', function () {
        var latch = false;
        done = function() {
            return latch;
        };

        var routes = app.match.get('/advice/apac/12786');
        var callback = routes[0].callbacks[0];

        var req = {params: {'adviceUID': 12786}};
        var res = {};

        res.render = jasmine.createSpy('res');

        callback(req, res, null);

        waitsFor(function(){return res.render.wasCalled;},'res.redirect() is never called',1000);
        runs(function () {
                expect(res.render.mostRecentCall.args[1].resultJson).toContain('Amazon best title');
                expect(res.render.mostRecentCall.args[1].resultJson).toContain('Hitler');

                Advice.findByUID(12786, function(err, advice){
                    if (!err) {
                        expect(advice.amazon.title).toEqual('Amazon best title');
                        expect(advice.amazon.url).toContain('titleindb');
                        expect(advice.amazon.author).toEqual('A.Hitler');
                        expect(advice.amazon.imgSrc).toContain('somesome');
                        latch = true;
                    }
                });
                waitsFor(function() {return done();}, 'Advice is not updsated', 1000);
        });
    });
});