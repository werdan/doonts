var ObjectID = require('mongodb').BSONPure.ObjectID;

var roleId = new ObjectID();

exports.Advice = {
    advice1 : {roleId: roleId, uid:12785, text: "Best advice ever", nextFacebookInfoUpdateTime: 123123123, facebookLikes: 12, _id: new ObjectID()}
};

exports.Role = [
    {_id: roleId, uid: 144, name: "Project manager with spaces", advices: [exports.Advice.advice1._id]}
];