var ObjectID = require('mongodb').BSONPure.ObjectID;

exports.Advice = {
    advice1 : {uid:12785, text: "Best advice ever", facebookLikes: 177, _id: new ObjectID()},
    advice2 : {uid:12786, text: "The next best advice ever", facebookLikes: 12, _id: new ObjectID()},
};

exports.Role = [
    { uid: 144, name: "Project manager with spaces", advices: [exports.Advice.advice1._id, exports.Advice.advice2._id]}
];