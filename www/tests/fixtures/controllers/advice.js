var ObjectID = require('mongodb').BSONPure.ObjectID;

var roleId1 = new ObjectID();

exports.Advice = {
    advice1 : {roleId: roleId1, uid:12785, text: "Best advice ever", nextFacebookInfoUpdateTime: 123123123,
        facebookLikes: 12,
        _id: new ObjectID(),
        amazon: {asin: "ghagag"}},
    advice2 : {roleId: roleId1, uid:12786, text: "Best advice ever", nextFacebookInfoUpdateTime: 123123123,
        facebookLikes: 2, _id: new ObjectID(),
        amazon: {
            asin: "gajljagag",
            title: "Amazon best title",
            url: "http://titleindb.com",
            author: "A.Hitler",
            imgSrc: "http://somesomesome.jpg"
        }},
    advice3 : {roleId: roleId1, uid:12787, text: "Advice with youtube videoId",
        nextFacebookInfoUpdateTime: 99999,
        facebookLikes: 12, _id: new ObjectID(),
        youtube: {
            videoId: "HLDbx4Y_ybU"
        }},
    advice4 : {roleId: roleId1, uid:12788, text: "Advice with youtube media defined", nextFacebookInfoUpdateTime: 123123123,
        facebookLikes: 2, _id: new ObjectID(),
        youtube: {
            videoId: "yyjHgakg-d",
            title: "Youtube best title",
            url: "http://titleindbyoutube.com",
            imgSrc: "http://somesomesome-youtube.jpg"
        }},
    advice5 : {roleId: roleId1, uid:12789, text: "Advice with wrong youtube media videoId", nextFacebookInfoUpdateTime: 123123123,
        facebookLikes: 0, _id: new ObjectID(),
        youtube: {
            videoId: "yyjHgakg-d-wrong"
        }},
    advice6 : {roleId: roleId1, uid:12790, text: "Advice with wrong youtube media videoId", nextFacebookInfoUpdateTime: 123123123,
        facebookLikes: 0, _id: new ObjectID(),
        amazon: {
            asin: "B007J4T2G9"
        }}
};

exports.Role = [
    { _id: roleId1, uid: 144, name: "Project manager with spaces",
        advices: [exports.Advice.advice1._id,
                  exports.Advice.advice2._id,
                  exports.Advice.advice3._id,
                  exports.Advice.advice4._id,
                  exports.Advice.advice5._id,
                  exports.Advice.advice6._id
        ], totalFacebookLikes: 14}
];