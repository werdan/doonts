var Role = db.model("Role");

describe('Tests on role model', function(){
	beforeEach(function () {
		var latch = false;
		done = function() {
			return latch;
		};
		Role.remove(function() {
			Role.create({ uid: 144, 
				name: "Project manager with spaces",
				advices: [{text: "Best advice ever", id: 333, youtubeId: "lM8kEHjQz9U"},
				          {text: "Also a very good advice", id: 334, amazonId: "0226104206"}],
						}, function(){
					latch = true;
				});
		});
		waitsFor(done,"Before each init is timeouted",1000);
});
	
	it('Checks .href virtual property on Role', function () {
		var latch = false;
		done = function() {
			return latch;
		};

		Role.findByUID(144, function(err, role) {
			var href = app.set("web.unsecureUrl") + "/role/144/project-manager-with-spaces"; 
			expect(role.href).toEqual(href);
			latch = true;
		});
		waitsFor(done, "Role.href has been never checked",1000);
	});
	
	it('Checks Advice model consistency', function () {
		var latch = false;
		done = function() {
			return latch;
		};

		Role.findByUID(144, function(err, role) {
			var href = app.set("web.unsecureUrl") + "/role/144/project-manager-with-spaces"; 
			expect(role.href).toEqual(href);
			expect(role.advices.length).toEqual(2);
			expect(role.advices[0].id).toEqual(333);
			latch = true;
		});
		waitsFor(done, "Role.href has been never checked",1000);
	});

});