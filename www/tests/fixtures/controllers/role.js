var ObjectID = require('mongodb').BSONPure.ObjectID;

exports.Advice = {
    advice1 : {uid:12785, text: "Best advice ever", nextFacebookInfoUpdateTime: 123123123, facebookLikes: 12, _id: new ObjectID()}
};

exports.Role = [
    { uid: 144, name: "Project manager with spaces", advices: [exports.Advice.advice1._id]}
];