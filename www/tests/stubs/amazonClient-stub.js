module.exports = {
    execute: function(operation, params, callback) {
        var results = [];
        results['Items'] = [];
        results['Items']['Item'] = [];
        results['Items']['Item']['ASIN'] = '123123123';

        results['Items']['Item']['ItemAttributes'] = [];
        results['Items']['Item']['ItemAttributes']['Title'] = 'Test title';
        results['Items']['Item']['DetailPageURL'] = 'http://something.com';
        results['Items']['Item']['ItemAttributes']['Author'] = "Test author";

        callback(null, results);
    }
};