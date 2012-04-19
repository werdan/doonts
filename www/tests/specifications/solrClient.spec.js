var Role = db.model("Role");

describe('Solr client test', function(){

	it("checks that role is updated in Solr on-save", function(){

        var solrClientFactoryMock = {
            getClient: function(){}
        };

        var mockClient = {
            add: function(){}
        };

        spyOn (mockClient, 'add');

        spyOn(solrClientFactoryMock,'getClient').andReturn(mockClient);

        var role = {
            uid: 167,
            name: "Big test solr",
            advices: new Array({
               text: "first advice"
            },{
                text: "second advice"
            },{
                text: "third advice new"
            }),
            getRole: function() {}
        };

        role.getRole = function(callback) {
            callback(role);
        }

        var next = function(){};

        var schemaMock = {pre: function(){}, getRole: function(next) {return ;}};

        spyOn(schemaMock, 'pre');

        var solrUpdaterPlugin = require('../../models/plugins/solrUpdaterPlugin.js');

        solrUpdaterPlugin(schemaMock,solrClientFactoryMock);
        var onsaveFunc = schemaMock.pre.mostRecentCall.args[1];

        onsaveFunc.call(role,function(){});

        waitsFor(function(){return mockClient.add.wasCalled},'solrClient.add() never called',1000);
		runs(function(){
            expect(mockClient.add.mostRecentCall.args[0].roleId).toEqual(167);
            expect(mockClient.add.mostRecentCall.args[0].name).toEqual("Big test solr");
            expect(mockClient.add.mostRecentCall.args[0].advices).toContain(" third");
            expect(mockClient.add.mostRecentCall.args[0].advices).toContain("first");
		});
	});

});