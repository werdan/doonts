var fixtures = require('mongoose-fixtures');
var Advice = db.model("Advice");
var Role = db.model("Role");

describe('Tests on cronjobs', function(){
	beforeEach(function () {
		var latch = false;
		done = function() {
			return latch;
		};
        fixtures.load(__dirname + '/../fixtures/cronjob.js', function() {
            latch = true;
        });
		waitsFor(done,"Before each init is timeouted",1000);
	});
	
	it('tests facebookLikesUpdate cronjob', function () {
	    var fb = require("../../tests/stubs/facebook-api-stub");
	    var facebookLikesUpdateJob = require("../../cron/facebookLikesUpdateJob")(fb);
	    facebookLikesUpdateJob.run();
	    waits(1000);
	    runs(function(){
	        var latch1 = false;
	        var latch2 = false;
	        var latch3 = false;
	        done = function() {
	            return latch1 && latch2 && latch3;
	        };
	        Advice.findByUID(130, function(err,advice){
	            expect(advice.facebookLikes).toEqual(17804);
	            expect(parseInt(advice.nextFacebookInfoUpdateTime)).toBeGreaterThan(Date.now());
	            latch1 = true;
	        });
            Advice.findByUID(159, function(err,advice){
                expect(advice.facebookLikes).toEqual(0);
                expect(parseInt(advice.nextFacebookInfoUpdateTime)).toBeGreaterThan(Date.now());
                latch2 = true;
            });
            Role.findByUID(144, function(err,role){
                expect(parseInt(role.totalFacebookLikes)).toEqual(17804);
                latch3 = true;
            });
	        waitsFor(done,"",1000);
	    });
	});
	
});