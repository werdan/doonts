var userModel = require('../models/user');
var ObjectID = require('mongodb').ObjectID;

function createUser(userId, access_token) {
	var db = app.set('db');
	var newUser = new userModel.User(userId, access_token);

	db.collection('users', function(err, collection){
		if(err){
            onError();
            return;
		}
		collection.insert(newUser,{safe:true}, function(error,objects){
	        if(error){
	                onError();
	                return;
	        } 
		});
	});
	
	return newUser;
}
exports.createUser = createUser;

function save(user) {
}

exports.save = save;

function getById (userId, callback) {
	var db = app.set('db');
	db.collection('users', function(err, collection){
		if(err){
            onError();
            return;
		}
		collection.find({_id: new ObjectID(userId)}, {limit:1}, function(err,cursor){
	            if(err){
	                onError();
	                return;
	            }
	            cursor.toArray(function(err, items) {
		            if(docs.length == 0){
		            	callback;
		            } else {
		            	callback(docs[0]);
		            }
	            });
			});
			});
}

exports.getById = getById;



