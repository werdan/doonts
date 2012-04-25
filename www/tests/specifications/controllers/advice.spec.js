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
	
	it('checks like/unlike event handler - when adviceId is not correct', function () {
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
            
            waits(700);
            runs(function () {
                latch = false;
                expect(res.render).toHaveBeenCalledWith('empty.ejs');
                Advice.findByUID(12785, function(err, advice){
                    if (!err) {
                        expect(parseInt(advice.facebookLikes)).toEqual(13);
                        expect(advice.nextFacebookInfoUpdateTime).toEqual(0);
                        advice.getRole(function(err, role){
                            expect(parseInt(role.totalFacebookLikes)).toEqual(29);
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

    it('checks that advice/media/amazon action updates advice', function () {
        var latch = false;
        done = function() {
            return latch;
        };

        Advice.findByUID(12785, function(err, advice){
            if (!err) {
                expect(advice.hasOwnProperty('amazon')).toBeFalsy();
                latch = true;
            }
        });

        waitsFor(function() {return done();}, 'Advice is not updated', 1000);
        runs(function(){
            var routes = app.match.get('/advice/media/amazon/12785');
            var callback = routes[0].callbacks[0];

            var req = {params: {'adviceUID': 12785, mediaType: 'amazon'}};

            var res = {};

            res.render = jasmine.createSpy('res');

            var next = jasmine.createSpy('next');

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

    it('checks that advice/media/amazon does not updates advice when amazon info has been already downloaded', function () {
        var latch = false;
        done = function() {
            return latch;
        };

        var routes = app.match.get('/advice/media/amazon/12786');
        var callback = routes[0].callbacks[0];

        var req = {params: {'adviceUID': 12786, mediaType: 'amazon'}};
        var res = {};

        res.render = jasmine.createSpy('res');
        var next = jasmine.createSpy('next');

        callback(req, res, next);

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

    it('checks that advice/media/amazon does not updates advice when amazon.asin is not defined', function () {
        var routes = app.match.get('/advice/media/amazon/12787');
        var callback = routes[0].callbacks[0];

        var req = {params: {'adviceUID': 12787, mediaType: 'amazon'}};

        var next = jasmine.createSpy('next');

        callback(req, null, next);

        waitsFor(function(){return next.wasCalled;},'next is never called',1000);
        runs(function () {
            expect(next.mostRecentCall.args[0] instanceof Error).toBeTruthy();
        });
    });

    it('checks that advice/media/amazon throws error advice when amazon.asin saved in advice is not valid', function () {
        var adviceAmazonUpdater = require('../../../controllers/helper/adviceAmazonUpdater.js');
        var amazonClient = require("../../../lib/amazonClient.js");
        var next = jasmine.createSpy('next');

        Advice.findByUID(12790, function(err, advice){
            adviceAmazonUpdater(amazonClient, advice, null, next);
        });

        waitsFor(function(){return next.wasCalled;},'next is never called',1000);
        runs(function () {
            expect(next.mostRecentCall.args[0] instanceof Error).toBeTruthy();
        });
    });

    it('checks that advice/media/youtube action updates advice', function () {
        var latch = false;
        done = function() {
            return latch;
        };

        Advice.findByUID(12787, function(err, advice){
            if (!err) {
                expect(advice.youtube.videoId.length > 0).toBeTruthy();
                expect(advice.youtube.title).toBeUndefined();
                latch = true;
            }
        });

        waitsFor(function() {return done();}, 'Advice is not updated', 1000);
        runs(function(){
            var routes = app.match.get('/advice/media/youtube/12785');
            var callback = routes[0].callbacks[0];

            var req = {params: {'adviceUID': 12787, mediaType: 'youtube'}};

            var res = {};

            res.render = jasmine.createSpy('res');

            callback(req, res, null);

            waitsFor(function(){return res.render.wasCalled;},'res.redirect() is never called',1000);

            latch = false;
            runs(function () {
                expect(res.render.mostRecentCall.args[1].resultJson).toContain('Comedy Club');
                //Check for URL
                expect(res.render.mostRecentCall.args[1].resultJson).toContain('http://www.youtube.com/watch?v=HLD');
                expect(res.render.mostRecentCall.args[1].resultJson).toContain('http://i.ytimg.com');

                Advice.findByUID(12787, function(err, advice){
                    if (!err) {
                        expect(advice.youtube.title).toEqual('Comedy Club 2010 Случай В Семье Тусовщиков REMIXED');
                        expect(advice.youtube.url).toContain('http://www.youtube.com/watch?v=HLDbx4Y_ybU');
                        expect(advice.youtube.imgSrc).toContain('http://i.ytimg.com');
                        latch = true;
                    }
                });
                waitsFor(function() {return done();}, 'Advice is not updated', 1000);
            });
        });
    });

    it('checks that advice/media/youtube does not updates advice when amazon info has been already downloaded', function () {
        var latch = false;
        done = function() {
            return latch;
        };

        var routes = app.match.get('/advice/media/youtube/12788');
        var callback = routes[0].callbacks[0];

        var req = {params: {'adviceUID': 12788, mediaType: 'youtube'}};
        var res = {};

        res.render = jasmine.createSpy('res');
        var next = jasmine.createSpy('next');

        callback(req, res, next);

        waitsFor(function(){return res.render.wasCalled;},'res.redirect() is never called',1000);
        runs(function () {
            expect(res.render.mostRecentCall.args[1].resultJson).toContain('Youtube best title');
            //Check for URL
            expect(res.render.mostRecentCall.args[1].resultJson).toContain('http://titleindbyoutube.com');
            expect(res.render.mostRecentCall.args[1].resultJson).toContain('http://somesomesome-youtube.jpg');

            Advice.findByUID(12788, function(err, advice){
                if (!err) {
                    expect(advice.youtube.title).toEqual('Youtube best title');
                    expect(advice.youtube.url).toContain('http://titleindbyoutube.com');
                    expect(advice.youtube.imgSrc).toContain('http://somesomesome-youtube.jpg');
                    latch = true;
                }
            });
            waitsFor(function() {return done();}, '', 1000);
        });
    });

    it('checks that advice/media/youtube does not updates advice when youtube.videoId is not defined', function () {
        var latch = false;
        done = function() {
            return latch;
        };

        var routes = app.match.get('/advice/media/amazon/12785');
        var callback = routes[0].callbacks[0];

        var req = {params: {'adviceUID': 12785, mediaType: 'youtube'}};

        var next = jasmine.createSpy('next');

        callback(req, null, next);

        waitsFor(function(){return next.wasCalled;},'next is never called',1000);
        runs(function () {
            expect(next.mostRecentCall.args[0] instanceof Error).toBeTruthy();
        });
    });

    it('checks youtubeClient', function () {
        var latch = false;
        done = function() {
            return latch;
        };

        var youtubeClient = require("../../../lib/youtubeClient.js");

        Advice.findByUID(12787, function(err, advice){
            youtubeClient.execute(advice.youtube.videoId, null,
                function (err, resultString) {
                    expect(err).toBeNull();
                    expect(resultString).toContain('default');
                    latch = true;
                });
        });
        waitsFor(function(){return done()});
    });

    it('checks that youtubeClient returns error, when given wrong videoId', function () {
        var next = jasmine.createSpy('next');

        var youtubeClient = require("../../../lib/youtubeClient.js");

        Advice.findByUID(12789, function(err, advice){
            youtubeClient.execute(advice.youtube.videoId, next,
                function (err, resultString) {
                });
        });
        waitsFor(function(){return next.wasCalled});
        runs(function(){
            var err = next.mostRecentCall.args[0];
            expect(err instanceof Error).toBeTruthy();
        });
    });

    it('checks that setting amazon.asin on advice updates totalMedia of corresponding role', function () {
        var latch = false;
        done = function() {
            return latch;
        };

        Advice.findByUID(12787, function(err, advice){
            if (!err) {
                expect(advice.amazon.asin).toBeUndefined();

                advice.amazon.asin = 'teststest';
                advice.save(function(){

                    waits(1000);
                    runs(function(){
                        Advice.findByUID(12787, function(err, advice){
                            if (!err) {
                                advice.getRole(function(err, role){
                                    expect(parseInt(role.totalMedia)).toEqual(6);
                                    latch = true;
                                });
                            }
                        });
                        waitsFor(function() {return done();}, 'Advice is not updated', 1000);
                    });
                });
            }
        });
    });
});