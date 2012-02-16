describe('advice controller', function(){
	
    beforeEach(function () {
        var latch = false;
        done = function() {
            return latch;
        };
        waitsFor(done,"Before each init is timeouted",1000);
    });
	
});