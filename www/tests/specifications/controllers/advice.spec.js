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

                    waits(3000);
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

    it('checks that new advice is saved in session', function () {
        var routes = app.match.post('/advice/create/144');
        var callback = routes[0].callbacks[0];

        var req = {params: {'roleUID': 144}, session: {}, body: {text: "New advice text"}};

        var next = jasmine.createSpy('next');

        callback(req, null, next);

        waitsFor(function(){return next.wasCalled;},'next is never called',10000);
        runs(function () {
            expect(next.mostRecentCall.args[0] instanceof Error).toBeFalsy();
            expect(req.session.newAdvice.text).toEqual("New advice text");
            expect(req.session.newAdvice.roleId).toBeDefined();
        });
    });

    it('checks parsing of youtube link', function () {
        var routes = app.match.post('/advice/create/144');
        var callback = routes[0].callbacks[0];

        var req = {params: {'roleUID': 144}, session: {}, body: {mediaType: 'youtube',
            mediaLink: 'http://www.youtube.com/watch?v=8mwKq7_JlS8&feature=g-vrec',
            text: "New advice text"}};

        var next = jasmine.createSpy('next');

        callback(req, null, next);

        waitsFor(function(){return next.wasCalled;},'next is never called',10000);
        runs(function () {
            expect(next.mostRecentCall.args[0] instanceof Error).toBeFalsy();
            expect(req.session.newAdvice.text).toEqual("New advice text");
            expect(req.session.newAdvice.roleId).toBeDefined();
            expect(req.session.newAdvice.youtube).toEqual('8mwKq7_JlS8');
        });
    });

    it('checks parsing of amazon link', function () {
        var routes = app.match.post('/advice/create/144');
        var callback = routes[0].callbacks[0];

        var req = {params: {'roleUID': 144}, session: {}, body: {mediaType: 'amazon',
            mediaLink: 'http://www.amazon.com/Information-Rules-Strategic-Network-Economy/dp/087584863X/ref=wl_it_dp_o_pC_S?ie=UTF8&coliid=I2QZEXQQ7VN06K&colid=12IPLBPF7Y4A6',
            text: "New advice text"}};

        var next = jasmine.createSpy('next');

        callback(req, null, next);

        waitsFor(function(){return next.wasCalled;},'next is never called',10000);
        runs(function () {
            expect(next.mostRecentCall.args[0] instanceof Error).toBeFalsy();
            expect(req.session.newAdvice.text).toEqual("New advice text");
            expect(req.session.newAdvice.roleId).toBeDefined();
            expect(req.session.newAdvice.amazon).toEqual('087584863X');
        });
    });

    it('checks that new advice is set in session created without advice text', function () {
        var routes = app.match.post('/advice/create/144');
        var callback = routes[0].callbacks[0];

        var req = {params: {'roleUID': 144}, session: {}, body: {}};

        var next = jasmine.createSpy('next');

        callback(req, null, next);

        waitsFor(function(){return next.wasCalled;},'next is never called',10000);
        runs(function () {
            expect(next.mostRecentCall.args[0] instanceof Error).toBeTruthy();
        });
    });


    it('checks that new advice is not set in session with incorrect roleId', function () {
        var routes = app.match.post('/advice/create/199');
        var callback = routes[0].callbacks[0];

        var req = {params: {'roleUID': 199}, session: {}, body: {text: "New advice text"}};

        var next = jasmine.createSpy('next');

        callback(req, null, next);

        waitsFor(function(){return next.wasCalled;},'next is never called',10000);
        runs(function () {
            expect(next.mostRecentCall.args[0] instanceof Error).toBeTruthy();
        });
    });

    it('checks that new advice is not changed in session, if there is another one in it', function () {
        var routes = app.match.post('/advice/create/144');
        var callback = routes[0].callbacks[0];

        var req = {params: {'roleUID': 144}, session: {newAdvice: {text: "Old advice text", roleId: "46474849"}}, body: {text: "New advice text"}};

        var next = jasmine.createSpy('next');


        waitsFor(function(){return next.wasCalled;},'next is never called',10000);
        callback(req, null, next);
        runs(function () {
            expect(next.mostRecentCall.args[0] instanceof Error).toBeFalsy();
            expect(req.session.newAdvice.text).toEqual("Old advice text");
            expect(req.session.newAdvice.roleId).toEqual("46474849");
        });
    });

    it('checks that new advice is created from information stored in session - no youtube/amazon media links attached', function () {
        var latch = false;
        done = function() {
            return latch;
        };

        var routes = app.match.post('/advice/create/144');
        var callback = routes[0].callbacks[2];

        var req = {};
        var res = function() {};
        res.redirect = function() {};
        spyOn(res, 'redirect');

        Role.findByUID(144, function(err, role){
            req = {params: {'roleUID': 144}, session: {userId: 123123123, newAdvice: {text: "New advice text", roleId: role._id, youtube: '8mwKq7_JlS8'}}};
            callback(req, res, null);
        });
        waitsFor(function(){return res.redirect.wasCalled;},'res.redirect is never called',10000);
        runs(function () {
            expect(res.redirect.mostRecentCall.args[0]).toContain('/role/view/144');
            expect(typeof req.session.newAdvice === 'undefined').toBeTruthy();
            Advice.findByUID('12791',function(err, advice){
                expect(advice.text).toEqual("New advice text");
                expect(advice.author).toBeDefined();
                expect(advice.youtube.videoId).toEqual('8mwKq7_JlS8');
                advice.getRole(function(err, role){
                    expect(role.uid).toEqual(144);
                    expect(role.advices.length).toEqual(7);
                    latch = true;
                });
            });
            waitsFor(function() {return done();}, 'Advice not found');
        });
    });
});