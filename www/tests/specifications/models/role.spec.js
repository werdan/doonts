var fixtures = require('mongoose-fixtures');
var Role = db.model("Role");
var Advice = db.model("Advice");


describe('Tests on role model', function(){
	beforeEach(function () {
		var latch = false;
		done = function() {
			return latch;
		};
		fixtures.load(__dirname + '/../../fixtures/models/role.js', function() {
		    latch = true;
		});
		waitsFor(done,"Before each init is timeouted",1000);
	});
	
	it('Checks .href virtual property on Role', function () {
		var latch = false;
		done = function() {
			return latch;
		};

		Role.findByUID(144, function(err, role) {
			var href = app.set("web.unsecureUrl") + "/role/view/144/project-manager-with-spaces"; 
			expect(role.href).toEqual(href);
			latch = true;
		});
		waitsFor(done, "Role.href has been never checked",1000);
	});

    xit('tests .getTop() function with empty params', function () {
        var latch = false;
        done = function() {
            return latch;
        };

        Role.getTop(function(err, roles) {
            expect(roles.length).toEqual(href);
            latch = true;
        });
        waitsFor(done, "Role.href has been never checked",1000);
    });
	
	
	it('Checks Advice model consistency', function () {
		var latch = false;
		done = function() {
			return latch;
		};
        Role.findOne({uid:144})
            .populate('advices')
            .run(function(err, role) {
                var href = app.set("web.unsecureUrl") + "/role/view/144/project-manager-with-spaces"; 
                expect(role.href).toEqual(href);
                expect(role.advices.length).toEqual(2);
                expect(parseInt(role.advices[0].uid)).toEqual(12785);
                expect(parseInt(role.advices[0].facebookLikes)).toEqual(177);
                latch = true;
            });
        waitsFor(done, "Role.href has been never checked",1000);
     });
});