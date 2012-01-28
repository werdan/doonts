var User = db.model("User");

describe('Tests on user model', function(){

	beforeEach(function () {
		var latch = false;
		done = function() {
			return latch;
		};
		User.remove(function() {
			User.create({ uid: 14123333, 
						  first_name: "Andriy",
						  last_name: "Samilyak"
						}, 
						function(){
							latch = true;
						});
		});
		waitsFor(done,"Before each init is timeouted",1000);
	});
	
	it('checks User.findByUID virtual method', function () {
		var latch = false;
		done = function() {
			return latch;
		};

		User.findByUID(1233, function(err, user) {
			expect(user).toEqual(null);
			latch = true;
		});
		waitsFor(done, "Role.href has been never checked",1000);
		
		latch = false;
		User.findByUID(14123333, function(err, user) {
			expect(user.uid).not.toBeUndefined();
			latch = true;
		});
		
		
	});

});