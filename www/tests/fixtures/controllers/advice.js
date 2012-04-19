var ObjectID = require('mongodb').BSONPure.ObjectID;

var roleId1 = new ObjectID();

exports.Advice = {
    advice1 : {roleId: roleId1, uid:12785, text: "Best advice ever", nextFacebookInfoUpdateTime: 123123123, facebookLikes: 12, _id: new ObjectID()},
    advice2 : {roleId: roleId1, uid:12786, text: "Best advice ever", nextFacebookInfoUpdateTime: 123123123,
        facebookLikes: 2, _id: new ObjectID(),
        amazon: {
            title: "Amazon best title",
            url: "http://titleindb.com",
            author: "A.Hitler",
            imgSrc: "http://somesomesome.jpg"
        }}
};

exports.Role = [
    { _id: roleId1, uid: 144, name: "Project manager with spaces", advices: [exports.Advice.advice1._id, exports.Advice.advice2._id], totalFacebookLikes: 14}
];