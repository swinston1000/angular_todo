var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// Connect to MongoDB and create/use database called todoAppTest
mongoose.connect('mongodb://swinston100:hsyniu123@ds163677.mlab.com:63677/todoapp')
    .then(() => console.log('Mongo DB connection successful'))
    .catch((err) => console.error(err));

// Create a schema

var TodoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean,
    category: String,
    priority: Number,
    //updated_at: { type: Date, default: Date.now },
});

var Todo = mongoose.model('Todo', TodoSchema);


var UserScema = new mongoose.Schema({
    email: String,
    todos: [TodoSchema]
});

var User = mongoose.model('User', UserScema);


// Create a model based on the schema and export
module.exports = { todos: Todo, users: User }
