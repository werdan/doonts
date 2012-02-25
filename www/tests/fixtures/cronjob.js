var ObjectID = require('mongodb').BSONPure.ObjectID;

var roleId1 = new ObjectID();

exports.Advice = {
    advice1 : {roleId: roleId1, uid:130, text: "Best advice ever", nextFacebookInfoUpdateTime: Date.now()-1000, _id: new ObjectID()},
    advice3 : {roleId: roleId1, uid:159, text: "The last advice", nextFacebookInfoUpdateTime: 0, _id: new ObjectID()},
    advice2  : {roleId: roleId1, uid:128, text: "The next best advice ever", nextFacebookInfoUpdateTime: Date.now()+1000, _id: new ObjectID()}
};

exports.Role = [
    {_id: roleId1, uid: 144, name: "Project manager with spaces", advices: [
                                                               exports.Advice.advice1._id, 
                                                               exports.Advice.advice2._id,
                                                               exports.Advice.advice3._id]}
];