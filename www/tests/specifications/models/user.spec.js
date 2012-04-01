var User = db.model("User");
var fixtures = require('mongoose-fixtures');

describe('Tests on user model', function(){

	beforeEach(function () {
		var latch = false;
		done = function() {
			return latch;
		};
        fixtures.load(__dirname + '/../../fixtures/models/user.js', function() {
            latch = true;
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

    it('checks User.findByIds virtual method', function () {
            var latch = false;
            done = function() {
                return latch;
            };

            var userIds = [];
            User.find({},function(err, users) {
                users.forEach(function(user){
                    userIds.push(user._id);
                    //Intentionaly pushing twice to get copies in array
                    userIds.push(user._id);
                });
                User.findByIds(userIds,function(err,foundUsers){
                    expect(foundUsers.length).toEqual(3);
                    latch = true;
                });
            });
            waitsFor(done, "User.findByIds has been never checked",1000);
    });
});