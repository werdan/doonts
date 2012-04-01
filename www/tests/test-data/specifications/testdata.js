var fixtures = require('mongoose-fixtures');
var Advice = db.model("Advice");
var Role = db.model("Role");

describe('Tests on cronjobs', function(){
	beforeEach(function () {
		var latch = false;
		done = function() {
			return latch;
		};
        fixtures.load(__dirname + '/../fixtures/testdata.js', function() {
            latch = true;
        });
		waitsFor(done,"Before each init is timeouted",1000);
	});
	
	it('imports test data', function () {
	});
	
});