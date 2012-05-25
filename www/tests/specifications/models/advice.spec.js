var fixtures = require('mongoose-fixtures');
var Advice = db.model("Advice");
var Role = db.model("Role");

describe('Tests on advice model', function(){
	beforeEach(function () {
		var latch = false;
		done = function() {
			return latch;
		};
        fixtures.load(__dirname + '/../../fixtures/models/advice.js', function() {
            latch = true;
        });
		waitsFor(done,"Before each init is timeouted",1000);
	});

    it('tests defaults of advice', function () {
        var latch = false;
        done = function() {
            return latch;
        };
        Advice.create({text: 'test', uid: 201}, function(err,advice){
            expect(advice.nextFacebookInfoUpdateTime).toBeGreaterThan(100000);
            expect(advice.facebookLikes).toEqual(0);
            latch = true;
        });
        waitsFor(done, "Function has been never called",1000);
    });

    it('tests advice text minimal length validation', function () {
        var latch = false;
        done = function() {
            return latch;
        };
        Advice.create({text: '', uid: 203}, function(err,advice){
            expect(err).not.toBeNull();
            latch = true;
        });
        waitsFor(done, "Function has been never called",1000);
    });

    it('tests advice text max length validation', function () {
        var latch = false;
        done = function() {
            return latch;
        };
        Advice.create({text: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                             '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
                             '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
            uid: 203}, function(err,advice){
            expect(err).not.toBeNull();
            latch = true;
        });
        waitsFor(done, "Function has been never called",1000);
    });

	it('tests findReadyForFacebookUpdate function', function () {
		var latch = false;
		done = function() {
			return latch;
		};
		Advice.findReadyForFacebookUpdate(function(err, advices) {
            expect(advices.length).toEqual(2);
		    latch = true;
		});
		waitsFor(done, "",10000);
	});
	
	it('tests get role of advice', function () {
	    var latch = false;
	    done = function() {
	        return latch;
	    };
	    Advice.findOne({uid:12788}, function(err,advice){
	        advice.getRole(function(err, role) {
	            expect(role.uid).toEqual(145);
	            expect(role.hasAdvices).toBeTruthy();
	            latch = true;
	        });
	    });
        waitsFor(done, "",1000);
	 });
	
    it('tests Advice.findTop(100 from 4th) - ask more then we have', function () {
        var latch = false;
        done = function() {
            return latch;
        };
        waits(500);
        runs(function(){
            Advice.findTop(100, 3, function(err, roles) {
                //We expect less than asked and it should be ok
                expect(roles.length).toEqual(3);
                latch = true;
            });
            waitsFor(done, "Function has been never called",1000);
        });
    });

	
    it('tests Advice.findTop(5) function', function () {
        var latch = false;
        done = function() {
            return latch;
        };
        waits(500);
        runs(function(){
            Advice.findTop(5, function(err, roles) {
                expect(roles.length).toEqual(5);
                expect(parseInt(roles[0].uid)).toEqual(144);
                expect(parseInt(roles[1].uid)).toEqual(152);
                expect(parseInt(roles[2].uid)).toEqual(147);
                expect(parseInt(roles[3].uid)).toEqual(145);
                expect(parseInt(roles[4].uid)).toEqual(150);
                latch = true;
            });
            waitsFor(done, "Function has been never called",1000);
        });
    });

});