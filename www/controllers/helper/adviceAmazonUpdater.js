var logger = app.set("logger");

module.exports = function (client, advice, res, next) {

    if (advice.amazon.asin === undefined) {
        next(new Error("Trying to get Amazon data for Advice without Amazon media"));
        return;
    }


    if (advice.amazon.title) {
        var result = getResultWithAmazonInfo(advice);

        res.render('json.ejs', {resultJson:JSON.stringify(result),
            layout:"layout_ajax.ejs"});
    } else {
        client.execute('ItemLookup', {'ItemId':advice.amazon.asin,'RelationshipType':'AuthorityTitle','IncludeReviewsSummary':'false'},
            function (err, resultString) {
                if (err) {
                    next(new Error(err));
                    return;
                }

                if ('Request' in resultString['Items'] && 'Errors' in resultString['Items']['Request']) {
                    var err = resultString['Items']['Request']['Errors']['Error']['Message'];
                    next(new Error(err));
                    return;
                }

                logger.debug("Successfully received result from Amazon for ASIN=" + advice.amazon.asin);

                var result = extractAmazonInfo(advice, resultString);

                saveAdviceAmazonInfo(result, advice);

                res.render('json.ejs', {resultJson:JSON.stringify(result),
                    layout:"layout_ajax.ejs"});
        });
    }
}

function getAmazonImgSrc(asin) {
    var awsAssocId = app.set("web.amazon.assocId");
    return "http://ws.assoc-amazon.com/widgets/q?_encoding=UTF8&Format=_SL110_&ID=AsinImage&WS=1&tag=" + awsAssocId + "&ServiceVersion=20070822&ASIN=" + asin;
}

function extractAmazonInfo(advice, results) {
    var result = {asin:results['Items']['Item']['ASIN'],
        title:results['Items']['Item']['ItemAttributes']['Title'],
        url:results['Items']['Item']['DetailPageURL'],
        author:results['Items']['Item']['ItemAttributes']['Author'],
        imgSrc:getAmazonImgSrc(results['Items']['Item']['ASIN'])
    };
    return result;
}

function saveAdviceAmazonInfo(result, advice) {
    advice.amazon.title = result.title;
    advice.amazon.url = result.url;
    advice.amazon.author = result.author;
    advice.amazon.imgSrc = result.imgSrc;
    advice.save();
    return result;
}

function getResultWithAmazonInfo(advice) {
    var result = {
        title:advice.amazon.title,
        url:advice.amazon.url,
        author:advice.amazon.author,
        imgSrc:advice.amazon.imgSrc
    };
    return result;
}
