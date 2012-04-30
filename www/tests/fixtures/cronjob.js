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

var userId = new ObjectID();

exports.Advice = {
    advice1 : {roleId: roleId1, uid:130, text: "Best advice ever", nextFacebookInfoUpdateTime: Date.now()-1000, _id: new ObjectID()},
    advice3 : {roleId: roleId1, uid:159, text: "The last advice", nextFacebookInfoUpdateTime: 0, _id: new ObjectID()},
    advice2  : {roleId: roleId1, uid:128, text: "The next best advice ever", nextFacebookInfoUpdateTime: Date.now()+1000, _id: new ObjectID()},
    advice4  : {roleId: roleId1, uid:129, text: "The next best advice ever2", nextFacebookInfoUpdateTime: Date.now()+1000, _id: new ObjectID()},
    advice5  : {roleId: roleId1, uid:131, text: "The next best advice ever3", nextFacebookInfoUpdateTime: Date.now()+1000, _id: new ObjectID()},
    advice6  : {roleId: roleId1, uid:132, text: "The next best advice ever4", nextFacebookInfoUpdateTime: Date.now()+1000, _id: new ObjectID()}
};

exports.Role = [
    {_id: roleId1, uid: 144, name: "Project manager with spaces", advices: [
                                                               exports.Advice.advice1._id,
                                                               exports.Advice.advice2._id,
                                                               exports.Advice.advice3._id], author: userId, timestampCreated: Date.now()+10000},

    {_id: roleId2, uid: 145, name: "Project manager with spaces2", advices: [
                                                               exports.Advice.advice4._id], author: userId, timestampCreated: 1000},

    {_id: roleId3, uid: 146, name: "Project manager with spaces3", advices: [
                                                               exports.Advice.advice5._id], timestampCreated: Date.now()+10000},

    {_id: roleId4, uid: 147, name: "Project manager with spaces4", advices: [
                                                               exports.Advice.advice6._id], timestampCreated: 1000},

    {_id: roleId5, uid: 148, name: "Project manager with spaces5", author: userId, timestampCreated: Date.now()+10000},
    {_id: roleId6, uid: 149, name: "Project manager with spaces6", author: userId, timestampCreated: 1000},
    {_id: roleId7, uid: 150, name: "Project manager with spaces7", timestampCreated: Date.now()+10000},
    {_id: roleId8, uid: 151, name: "Project manager with spaces8", timestampCreated: 1000},
    {_id: roleId9, uid: 152, name: "Project manager with spaces9", timestampCreated: 2000},
]