describe('Static page controller', function(){

    it('checks routing to files using URL params', function () {
        var routes = app.match.get('/page/aboutus');
        var callback = routes[0].callbacks[0];

        var req = {params: {page: 'aboutus'}};

        var res = function() {};
        res.render = function() {};
        spyOn(res, 'render');

        runs(function(){
            callback(req, res, null);

            waitsFor(function(){return res.render.wasCalled;},'res.render() is never called',1000);
            runs(function () {
                var filename = res.render.mostRecentCall.args[0];
                expect(filename).toEqual('static/aboutus.ejs');
            });
        });
    });

    it('checks routing to file, when file does not exists', function () {
        var routes = app.match.get('/page/nofilelikethat');
        var callback = routes[0].callbacks[0];

        var req = {params: {page: 'nofilelikethat'}};

        var next = jasmine.createSpy('next');

        callback(req, null, next);

        waitsFor(function(){return next.wasCalled;},'next() is never called',1000);
    });


    it('checks routing to file, when filename param is absent', function () {
        var routes = app.match.get('/page/aboutus');
        var callback = routes[0].callbacks[0];

        var req = {params: {}};
        var next = jasmine.createSpy('next');

        runs(function(){
            callback(req, null, next);
            waitsFor(function(){return next.wasCalled;},'res.render() is never called',1000);
        });
    });
});