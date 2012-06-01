var ObjectID = require('mongodb').BSONPure.ObjectID;

var roleId1 = new ObjectID();
var roleId2 = new ObjectID();
var roleId3 = new ObjectID();

var authorId1 = new ObjectID();
var authorId2 = new ObjectID();

exports.User = [
    {_id: authorId1, uid: 123123123, first_name: "Artem", last_name: "Svitelskiy", gender: "male", locale: "uk_UA"},
    {_id: authorId2, uid: 123123232323, first_name: "Andriy", last_name: "Samilyak", gender: "male", locale: "uk_UA"}
];


exports.Advice = {
    advice1 : {roleId: roleId1, uid:12785, text: "Best advice ever", nextFacebookInfoUpdateTime: 123123123, facebookLikes: 12, _id: new ObjectID(), author: authorId1,
        youtube: {
            videoId: "HLDbx4Y_ybU"
        }
    },
    advice2 : {roleId: roleId2, uid:12786, text: "Best advice ever with video", nextFacebookInfoUpdateTime: 123123123, facebookLikes: 10, _id: new ObjectID(), author: authorId1,
        youtube: {
            videoId: "yyjHgakg-d",
            title: "Youtube best title",
            url: "http://titleindbyoutube.com",
            imgSrc: "http://somesomesome-youtube.jpg"
        }
    },
    advice3 : {roleId: roleId3, uid:12787, text: "Best advice ever with book", nextFacebookInfoUpdateTime: 123123123, facebookLikes: 10, _id: new ObjectID(), author: authorId1,
        amazon: {
            asin: "gajljagag",
            title: "Amazon best title",
            url: "http://titleindb.com",
            author: "A.Hitler",
            imgSrc: "http://somesomesome.jpg"
        }
    }
};



exports.Role = [
    {_id: roleId1, uid: 144, name: "Project manager with spaces", advices: [exports.Advice.advice1._id]},
    {_id: roleId2, uid: 145, name: "Project manager with spaces2", advices: [exports.Advice.advice2._id]},
    {_id: roleId3, uid: 146, name: "Project manager with spaces3", advices: [exports.Advice.advice3._id]}
];