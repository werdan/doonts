module.exports = function (client, advice, res, next) {

    if (advice.youtube.videoId === undefined) {
        next(new Error("Trying to get Youtube data for advice without Youtube media"));
        return;
    }

    if (advice.youtube.title) {
        var result = getJsonFromAdvice(advice);

        res.render('json.ejs', {resultJson:JSON.stringify(result),
            layout:"layout_ajax.ejs"});
    } else {
        client.execute(advice.youtube.videoId, next,
            function (err, resultString) {
                if (err) {
                    next(new Error(err));
                    return
                }

                var resultJson = JSON.parse(resultString);
                saveAdviceYoutubeInfo(resultJson, advice);

                res.render('json.ejs', {resultJson:resultString,
                    layout:"layout_ajax.ejs"});
            });
    }
}

function saveAdviceYoutubeInfo(result, advice) {
    advice.youtube.title = result['data']['title'];
    advice.youtube.url = result['data']['player']['default'];
    advice.youtube.imgSrc = result['data']['thumbnail']['sqDefault'];
    advice.save();
    return result;
}

function getJsonFromAdvice(advice) {
    var result = {data: {}};
    result.data = {title: advice.youtube.title,
                   player: {'default' : advice.youtube.url},
                   thumbnail: {'sqDefault' : advice.youtube.imgSrc}};
    return result;
}
