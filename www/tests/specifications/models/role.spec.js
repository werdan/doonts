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

    it('tests Role.findTop(4)', function () {
        var latch = false;
        done = function() {
            return latch;
        };
        waits(500);
        runs(function(){
            Role.findTop(4, function(err, roles) {
                expect(roles.length).toEqual(4);
                expect(parseInt(roles[0].uid)).toEqual(144);
                expect(parseInt(roles[1].uid)).toEqual(152);
                expect(parseInt(roles[2].uid)).toEqual(145);
                expect(parseInt(roles[3].uid)).toEqual(149);
                expect(roles[0].advices[1].text.length).toBeGreaterThan(5);
                latch = true;
            });
            waitsFor(done, "Function has been never called",1000);
        });
    });

    it('tests that findTop doesnot include roles without advices', function () {
        var latch = false;
        done = function() {
            return latch;
        };
        waits(500);
        runs(function(){
            Role.findTop(10, function(err, roles) {
                expect(roles.length).toEqual(9);
                latch = true;
            });
            waitsFor(done, "Function has been never called",1000);
        });
    });

    it('tests defaults of hasAdvices', function () {
        var latch = false;
        done = function() {
            return latch;
        };
        waits(500);
        runs(function(){
            Role.findByUID(153, function(err, role) {
                expect(role.hasAdvices).toBeDefined();
                expect(role.hasAdvices).toBeFalsy();
                latch = true;
            });
            waitsFor(done, "Function has been never called",1000);
        });
    });

    
	it('Checks Advice model consistency', function () {
		var latch = false;
		done = function() {
			return latch;
		};
        waits(1000);
        runs(function(){
            Role.findOne({uid:144})
            .populate('advices')
            .run(function(err, role) {
                var href = app.set("web.unsecureUrl") + "/role/view/144/project-manager-with-spaces"; 
                expect(role.href).toEqual(href);
                expect(role.advices.length).toEqual(3);
                expect(parseInt(role.advices[0].uid)).toEqual(12785);
                expect(parseInt(role.advices[0].facebookLikes)).toEqual(177);
                expect(parseInt(role.totalFacebookLikes)).toEqual(190);
                latch = true;
            });
            waitsFor(done, "Role.href has been never checked",1000);
        });
        });
});