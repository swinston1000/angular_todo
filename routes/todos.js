var express = require('express');
var router = express.Router();
var db = require('../models/model.js');


module.exports = function(io) {

    /* GET /todos listing. */
    router.get('/', function(req, res, next) {
        db.users.findOne({ email: req.user.email }, function(err, user) {
            if (err) return next(err);
            else if (user) res.json(user.todos)
            else {
                db.users.create({ email: req.user.email }, function(err, newuser) {
                    if (err) return next(err);
                    else res.json(null);
                });
            }
        })
    });

    /* POST /todos */
    router.post('/', function(req, res, next) {
        db.users.findOne({ email: req.user.email }, function(err, user) {
            if (err) return next(err);
            else {
                user.todos.push(req.body)
                user.save(function(err) {
                    newTodo = user.todos[user.todos.length - 1]
                    if (err) return next(err);
                    res.json(newTodo);
                });
            }
        })
    });

    /* DELETE /todos/:id */
    router.delete('/:id', function(req, res, next) {
        db.users.findOne({ email: req.user.email }, function(err, user) {
            user.todos.id(req.params.id).remove();
            user.save(function(err) {
                if (err) return next(err);
                else res.send("removed");
            });
        });
    });

    /* PUT /todos/:id */
    router.put('/:id', function(req, res, next) {
        db.users.findOneAndUpdate({ email: req.user.email, "todos._id": req.params.id }, { "todos.$": req.body },
            function(err, result) {;
                if (err) return next(err);
                else res.json(result);
            });
    });

    //delete multiple comma separated todos
    router.delete('/done/:id', function(req, res, next) {
        db.users.update({ email: req.user.email }, { $pull: { todos: { completed: true } } }, function(err, post) {
            if (err) return next(err);
            else res.json(post);
        });
    });

    //make this multi-user friendly!
    io.on("connection", function(socket) {
        //socket.broadcast.emit('change', { message: "hello" });   
        socket.on('update', function(data) {
            //console.log(data.message);
            socket.broadcast.emit('change', { message: "fromServer" });
        });
    });

    return router;
}
