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
	
	it('tests findReadyForFacebookUpdate function', function () {
		var latch = false;
		done = function() {
			return latch;
		};

		Advice.findReadyForFacebookUpdate(function(err, advices) {
		    expect(advices.length).toEqual(2);
		    latch = true;
		});
		waitsFor(done, "",1000);
	});
	
	it('tests get role of advice', function () {
	    var latch = false;
	    done = function() {
	        return latch;
	    };
	    Advice.findOne({uid:129}, function(err,advice){
	        Advice.getRoleUID(advice,function(err, role) {
	            expect(role.uid).toEqual(144);
	            latch = true;
	        });
	    });
        waitsFor(done, "",1000);
	 });
	
});