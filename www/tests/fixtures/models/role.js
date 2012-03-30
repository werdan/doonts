var ObjectID = require('mongodb').BSONPure.ObjectID;

var authorId1 = new ObjectID();

var roleId1 = new ObjectID();
var roleId2 = new ObjectID();
var roleId3 = new ObjectID();
var roleId4 = new ObjectID();
var roleId5 = new ObjectID();
var roleId6 = new ObjectID();
var roleId7 = new ObjectID();
var roleId8 = new ObjectID();
var roleId9 = new ObjectID();

var adviceId1 = new ObjectID();
var adviceId2 = new ObjectID();
var adviceId3 = new ObjectID();
var adviceId4 = new ObjectID();
var adviceId5 = new ObjectID();
var adviceId6 = new ObjectID();
var adviceId7 = new ObjectID();
var adviceId8 = new ObjectID();
var adviceId9 = new ObjectID();
var adviceId10 = new ObjectID();
var adviceId11 = new ObjectID();
var adviceId12 = new ObjectID();
var adviceId13 = new ObjectID();
var adviceId14 = new ObjectID();
var adviceId15 = new ObjectID();
var adviceId16 = new ObjectID();
var adviceId17 = new ObjectID();
var adviceId18 = new ObjectID();

exports.User = [
    {_id: authorId1, uid: 123123123, first_name: "Artem", last_name: "Svitelskiy", gender: "male", locale: "uk_UA"}
];


exports.Role = [
                { _id: roleId1,  uid: 144, name: "Project manager with spaces", advices: [adviceId1, adviceId2, adviceId3], author: authorId1},
                { _id: roleId2, uid: 145, name: "Project manager with spaces", advices: [adviceId4,adviceId5], author: authorId1},
                { _id: roleId3, uid: 146, name: "Project manager with spaces", advices: [adviceId6], author: authorId1},
                { _id: roleId4, uid: 147, name: "Project manager with spaces", advices: [adviceId7], author: authorId1},
                { _id: roleId5, uid: 148, name: "Project manager with spaces", advices: [adviceId8], author: authorId1},
                { _id: roleId6, uid: 149, name: "Project manager with spaces", advices: [adviceId9,adviceId10,adviceId11,adviceId12], author: authorId1},
                { _id: roleId7, uid: 150, name: "Project manager with spaces", advices: [adviceId13,adviceId14,adviceId15,adviceId16], author: authorId1},
                { _id: roleId8, uid: 151, name: "Project manager with spaces", advices: [adviceId17], author: authorId1},
                { _id: roleId9, uid: 152, name: "Project manager with spaces", advices: [adviceId18], author: authorId1},
                {uid: 153, name: "Empty role", author: authorId1}
                ];

exports.Advice = {
        //144 role
    advice1 : {roleId: roleId1, uid:12785, text: "Best advice ever", facebookLikes: 177, _id: adviceId1},
    advice2 : {roleId: roleId1, uid:12786, text: "The next best advice ever", facebookLikes: 12, _id: adviceId2},
    advice3 : {roleId: roleId1, uid:12787, text: "The next best advice ever", facebookLikes: 1, _id: adviceId3},
        //145 role
    advice4 : {roleId: roleId2, uid:12788, text: "The next best advice ever", facebookLikes: 2, _id: adviceId4},
    advice5 : {roleId: roleId2, uid:12789, text: "The next best advice ever", facebookLikes: 4, _id: adviceId5},
        //146 role
    advice6 : {roleId: roleId3, uid:12790, text: "The next best advice ever", facebookLikes: 0, _id: adviceId6},
        //147 role
    advice7 : {roleId: roleId4, uid:12791, text: "The next best advice ever", facebookLikes: 0, _id: adviceId7},
        //148 role
    advice8 : {roleId: roleId5, uid:12792, text: "The next best advice ever", facebookLikes: 0, _id: adviceId8},
        //149 role
    advice9 : {roleId: roleId6, uid:12793, text: "The next best advice ever", facebookLikes: 0, _id: adviceId9},
    advice10 : {roleId: roleId6, uid:12794, text: "The next best advice ever", facebookLikes: 2, _id: adviceId10},
    advice11 : {roleId: roleId6, uid:12795, text: "The next best advice ever", facebookLikes: 0, _id: adviceId11},
    advice12 : {roleId: roleId6, uid:12796, text: "The next best advice ever", facebookLikes: 2, _id: adviceId12},
    //150 role
    advice13 : {roleId: roleId7, uid:12797, text: "The next best advice ever", facebookLikes: 0, _id: adviceId13},
    advice14 : {roleId: roleId7, uid:12798, text: "The next best advice ever", facebookLikes: 3, _id: adviceId14},
    advice15 : {roleId: roleId7, uid:12799, text: "The next best advice ever", facebookLikes: 0, _id: adviceId15},
    advice16 : {roleId: roleId7, uid:12800, text: "The next best advice ever", facebookLikes: 0, _id: adviceId16},
    //151 role
    advice17 : {roleId: roleId8, uid:12801, text: "The next best advice ever", facebookLikes: 0, _id: adviceId17},
    //152 role
    advice18 : {roleId: roleId9, uid:12802, text: "The next best advice ever", facebookLikes: 10, _id: adviceId18}
};
