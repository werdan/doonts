var ObjectID = require('mongodb').BSONPure.ObjectID;

exports.Advice = {
    advice1 : {uid:130, text: "Best advice ever", nextFacebookInfoUpdateTime: Date.now()-1000, _id: new ObjectID()},
    advice3 : {uid:159, text: "The last advice", nextFacebookInfoUpdateTime: 0, _id: new ObjectID()},
    advice2  : {uid:128, text: "The next best advice ever", nextFacebookInfoUpdateTime: Date.now()+1000, _id: new ObjectID()}
};

exports.Role = [
    { uid: 144, name: "Project manager with spaces", advices: [
                                                               exports.Advice.advice1._id, 
                                                               exports.Advice.advice2._id,
                                                               exports.Advice.advice3._id]}
];