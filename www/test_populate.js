db = require('mongoose');
db.connect('mongodb://localhost/test');

var Schema = db.Schema, ObjectId = Schema.ObjectId;

var PersonSchema = new Schema({
  name    : String
, age     : Number
, stories : [{ type: Schema.ObjectId, ref: 'Story' }]
});

var StorySchema = new Schema({
  _creator : { type: Schema.ObjectId, ref: 'Person' }
, title    : String
, fans     : [{ type: Schema.ObjectId, ref: 'Person' }]
});

var Story  = db.model('Story', StorySchema);
var Person = db.model('Person', PersonSchema);

var aaron = new Person({ name: 'Aaron', age: 100 });

aaron.save(function (err) {
  var story1 = new Story({
      title: "A man who cooked Nintendo"
    , _creator: aaron._id
  });
  story1.save(function (err) {
      Story
      .findOne({ title: /Nintendo/i })
      .populate('_creator') // <--
      .run(function (err, story) {
      //  console.log(err);
        console.log(story);
        console.log('The creator is %s', story._creator.name);
      });
  });
});

