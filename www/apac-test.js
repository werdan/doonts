var sys = require('sys'),
    OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper({
    awsId:     'AKIAJIPCNYWM3IOPRN6A',
    awsSecret: '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',
    assocId:   'doonts-20'
});

var awsAssocId = 'doonts-20';

opHelper.execute('ItemLookup', {
    'ItemId': '0945320531',
    'RelationshipType': 'AuthorityTitle',
    'IncludeReviewsSummary' : 'false'
}, function(error, results) {
    opHelper.execute('ItemLookup', {
        'ItemId': '0945320531',
        'RelationshipType': 'AuthorityTitle',
        'IncludeReviewsSummary' : 'false'
    }, function(error, results) {
        if (error) {
            next(new Error(error));
        }

        var result = {title: results['Items']['Item']['ItemAttributes']['Title'],
            url: results['Items']['Item']['DetailPageURL'],
            author: results['Items']['Item']['ItemAttributes']['Author'],
            imgSrc: getImgSrc('0945320531')
        };
          console.log(results['Items']['Item']['ASIN']);
//        console.log(JSON.stringify(result));
    });

});

function getImgSrc(asin) {
    return "http://ws.assoc-amazon.com/widgets/q?_encoding=UTF8&Format=_SL110_&ID=AsinImage&WS=1&tag=" + awsAssocId + "&ServiceVersion=20070822&ASIN=" + asin;
}
