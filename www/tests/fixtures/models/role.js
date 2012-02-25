var ObjectID = require('mongodb').BSONPure.ObjectID;

var roleId1 = new ObjectID();
var roleId2 = new ObjectID();
var roleId3 = new ObjectID();
var roleId4 = new ObjectID();
var roleId5 = new ObjectID();
var roleId6 = new ObjectID();
var roleId7 = new ObjectID();
var roleId8 = new ObjectID();
var roleId9 = new ObjectID();

exports.Advice = {
        //144 role
    advice1 : {roleId: roleId1, uid:12785, text: "Best advice ever", facebookLikes: 177, _id: new ObjectID()},
    advice2 : {roleId: roleId1, uid:12786, text: "The next best advice ever", facebookLikes: 12, _id: new ObjectID()},
    advice3 : {roleId: roleId1, uid:12787, text: "The next best advice ever", facebookLikes: 1, _id: new ObjectID()},
        //145 role
    advice4 : {roleId: roleId2, uid:12788, text: "The next best advice ever", facebookLikes: 2, _id: new ObjectID()},
    advice5 : {roleId: roleId2, uid:12789, text: "The next best advice ever", facebookLikes: 4, _id: new ObjectID()},
        //146 role
    advice6 : {roleId: roleId3, uid:12790, text: "The next best advice ever", facebookLikes: 0, _id: new ObjectID()},
        //147 role
    advice7 : {roleId: roleId4, uid:12791, text: "The next best advice ever", facebookLikes: 0, _id: new ObjectID()},
        //148 role
    advice8 : {roleId: roleId5, uid:12792, text: "The next best advice ever", facebookLikes: 0, _id: new ObjectID()},
        //149 role
    advice9 : {roleId: roleId6, uid:12793, text: "The next best advice ever", facebookLikes: 0, _id: new ObjectID()},
    advice10 : {roleId: roleId6, uid:12794, text: "The next best advice ever", facebookLikes: 2, _id: new ObjectID()},
    advice11 : {roleId: roleId6, uid:12795, text: "The next best advice ever", facebookLikes: 0, _id: new ObjectID()},
    advice12 : {roleId: roleId6, uid:12796, text: "The next best advice ever", facebookLikes: 2, _id: new ObjectID()},
    //150 role
    advice13 : {roleId: roleId7, uid:12797, text: "The next best advice ever", facebookLikes: 0, _id: new ObjectID()},
    advice14 : {roleId: roleId7, uid:12798, text: "The next best advice ever", facebookLikes: 3, _id: new ObjectID()},
    advice15 : {roleId: roleId7, uid:12799, text: "The next best advice ever", facebookLikes: 0, _id: new ObjectID()},
    advice16 : {roleId: roleId7, uid:12800, text: "The next best advice ever", facebookLikes: 0, _id: new ObjectID()},
    //151 role
    advice17 : {roleId: roleId8, uid:12801, text: "The next best advice ever", facebookLikes: 0, _id: new ObjectID()},
    //152 role
    advice18 : {roleId: roleId9, uid:12802, text: "The next best advice ever", facebookLikes: 10, _id: new ObjectID()},
};

exports.Role = [
    { _id: roleId1,  uid: 144, name: "Project manager with spaces", totalFacebookLikes: 13, advices: [exports.Advice.advice1._id, exports.Advice.advice2._id, exports.Advice.advice3._id]},
    { _id: roleId2, uid: 145, name: "Project manager with spaces", totalFacebookLikes: 6,  advices: [exports.Advice.advice4._id, exports.Advice.advice5._id]},
    { _id: roleId3, uid: 146, name: "Project manager with spaces", totalFacebookLikes: 0,  advices: [exports.Advice.advice6._id]},
    { _id: roleId4, uid: 147, name: "Project manager with spaces", totalFacebookLikes: 0,  advices: [exports.Advice.advice7._id]},
    { _id: roleId5, uid: 148, name: "Project manager with spaces", totalFacebookLikes: 0,  advices: [exports.Advice.advice8._id]},
    { _id: roleId6, uid: 149, name: "Project manager with spaces", totalFacebookLikes: 4,  advices: [exports.Advice.advice9._id, exports.Advice.advice10._id, exports.Advice.advice11._id, exports.Advice.advice12._id]},
    { _id: roleId7, uid: 150, name: "Project manager with spaces", totalFacebookLikes: 3,  advices: [exports.Advice.advice13._id, exports.Advice.advice14._id, exports.Advice.advice15._id, exports.Advice.advice16._id]},
    { _id: roleId8, uid: 151, name: "Project manager with spaces", totalFacebookLikes: 0,  advices: [exports.Advice.advice17._id]},
    { _id: roleId9, uid: 152, name: "Project manager with spaces", totalFacebookLikes: 10,  advices: [exports.Advice.advice18._id]}
];