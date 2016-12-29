var express = require('express');
var router = express.Router();
var db = require('../models/model.js');

var authenticate = function(req, res, next) {
    if (!req.user.email) {
        next(new Error("Your account needs to be associated with an e-mail address, try another method of signing up."))
    } else if (!req.user.email_verified) {
        next(new Error("Please verify your e-mail address before continuing."))
    } else {
        next();
    }
}

module.exports = function(io) {

    /* GET /todos listing. */
    router.get('/', authenticate, function(req, res, next) {
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
    router.post('/', authenticate, function(req, res, next) {
        db.users.findUserAndAddTodo(req.user.email, req.body, function(err, newTodo) {
            if (err) return next(err);
            else res.json(newTodo);
        })
    });

    /* DELETE /todos/:id */
    router.delete('/:id', authenticate, function(req, res, next) {
        db.users.findOne({ email: req.user.email }, function(err, user) {
            user.todos.id(req.params.id).remove();
            user.save(function(err) {
                if (err) return next(err);
                else res.send("removed");
            });
        });
    });

    /* PUT /todos/:id */
    router.put('/:id', authenticate, function(req, res, next) {
        db.users.findOneAndUpdate({ email: req.user.email, "todos._id": req.params.id }, { "todos.$": req.body }, { new: true },

            function(err, result) {;
                if (err) return next(err);
                else res.json(result);
            });
    });

    //delete multiple comma separated todos
    router.delete('/done/:id', authenticate, function(req, res, next) {
        db.users.update({ email: req.user.email }, { $pull: { todos: { completed: true } } }, function(err, post) {
            if (err) return next(err);
            else res.json(post);
        });
    });

    //make this multi-user friendly!
    io.on("connection", function(socket) {
        socket.on('update', function(user) {
            socket.broadcast.emit('change', user);
        });
    });

    return router;
}
