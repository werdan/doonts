var ObjectID = require('mongodb').BSONPure.ObjectID;

var roleId = new ObjectID();

var authorId1 = new ObjectID();
var authorId2 = new ObjectID();

exports.User = [
    {_id: authorId1, uid: 123123123, first_name: "Artem", last_name: "Svitelskiy", gender: "male", locale: "uk_UA"},
    {_id: authorId2, uid: 123123232323, first_name: "Andriy", last_name: "Samilyak", gender: "male", locale: "uk_UA"}
];


exports.Advice = {
    advice1 : {roleId: roleId, uid:12785, text: "Best advice ever", nextFacebookInfoUpdateTime: 123123123, facebookLikes: 12, _id: new ObjectID(), author: authorId1}
};

exports.Role = [
    {_id: roleId, uid: 144, name: "Project manager with spaces", advices: [exports.Advice.advice1._id]}
];