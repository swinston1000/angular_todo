var mongoose = require('mongoose');

var mongoPassword = process.env.mongoPassword || require('../auth0-secret').mongoPassword


mongoose.Promise = global.Promise;
// Connect to MongoDB and create/use database called todoAppTest
mongoose.connect('mongodb://swinston100:' + mongoPassword + '@ds163677.mlab.com:63677/todoapp')
    .then(() => console.log('Mongo DB connection successful'))
    .catch((err) => console.error(err));

// Create a schema

var todoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean,
    category: String,
    priority: Number,
    //updated_at: { type: Date, default: Date.now },
});

var Todo = mongoose.model('Todo', todoSchema);


var userSchema = new mongoose.Schema({
    email: String,
    todos: [todoSchema]
});

userSchema.statics.findUserAndAddTodo = function(email, todo, cb) {
    return this.findOne({ email: email }, function(err, user) {
        if (err) cb(err);
        else {
            user.todos.push(todo)
            user.save(function(error) {
                if (error) {
                    cb(error)
                } else {
                    cb(null, "added")
                }
            });
        }
    })
}

var User = mongoose.model('User', userSchema);



// Create a model based on the schema and export
module.exports = { todos: Todo, users: User }
