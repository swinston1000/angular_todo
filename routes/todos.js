var express = require('express');
var router = express.Router();
var Todo = require('../models/model.js');


module.exports = function(io) {

    /* GET /todos listing. */
    router.get('/', function(req, res, next) {
        Todo.find(function(err, todos) {
            if (err) return next(err);
            else res.json(todos);
        });
    });

    /* POST /todos */
    router.post('/', function(req, res, next) {
        Todo.create(req.body, function(err, post) {
            if (err) return next(err);
            else res.json(post);
        });
    });

    /* DELETE /todos/:id */
    router.delete('/:id', function(req, res, next) {
        Todo.findByIdAndRemove(req.params.id, function(err, post) {
            if (err) return next(err);
            else res.json(post);
        });
    });

    /* PUT /todos/:id */
    router.put('/:id', function(req, res, next) {
        Todo.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
            if (err) return next(err);
            else res.json(post);
        });
    });

    //delete multiple comma separated todos
    router.delete('/done/:ids', function(req, res, next) {
        Todo.remove({ _id: { $in: req.params.ids.split(',') } }, function(err, post) {
            if (err) return next(err);
            else res.json(post);
        });
    });

    //on page load
    io.on("connection", function(socket) {
        //socket.broadcast.emit('change', { message: "hello" });   
        socket.on('update', function(data) {
            //console.log(data.message);
            socket.broadcast.emit('change', { message: "fromServer" });
        });
    });

    return router;
}
