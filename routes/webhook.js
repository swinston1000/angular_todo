var express = require('express');
var router = express.Router();
var db = require('../models/model.js');

var webhookSecret = process.env.WEBHOOK_SECRET || require('../auth0-secret').webhookSecret
var linkingSecret = process.env.LINKING_SECRET || require('../auth0-secret').linkingSecret


var buttons = require("../message_factory/messengerbuttons")
var messageFactory = require("../message_factory/factory")

router.post('/', function(req, res) {

    if (req.body.entry && req.body.entry[0].messaging) {
        console.log("inpost");
        console.log(req.body.entry[0].messaging[0]);
    }

    req.body.entry.forEach(function(entry) {
        entry.messaging.forEach(function(data) {

            var message = data.message;
            var account_linking = data.account_linking
            var senderID = data.sender.id;

            if (message && message.quick_reply && message.quick_reply.payload.startsWith("PRIORITY")) {

                var todo = JSON.parse(message.quick_reply.payload.substr(9))
                todo.priority = message.text
                todo = JSON.stringify(todo)
                console.log(todo);

                var options = {
                    text: "What is the task category?",
                    payload: "TASK_" + todo,
                    buttons: ["Work", "Personal", "Delegated", "Other"]
                }

                messageFactory.sendMessage(senderID, buttons("quick", options))

            } else if (message && message.quick_reply && message.quick_reply.payload.startsWith("TASK")) {

                var todo = JSON.parse(message.quick_reply.payload.substr(5))
                todo.completed = false
                todo.category = message.text
                var user = todo.email
                delete todo.email

                db.users.findOne({ email: user }, function(err, user) {
                    if (err) return next(err);
                    else {
                        user.todos.push(todo)
                        user.save(function(err) {
                            if (err) messageFactory.sendMessage(senderID, { text: "There was an error adding your item!" })
                            else messageFactory.sendMessage(senderID, { text: "Thanks your to do has been added" })
                        });
                    }
                })

            } else if (message) {
                messageFactory.buildReply(senderID, message.text, function(err, reply) {
                    if (err) {
                        console.error(err);
                        reply = { text: "Sorry we are having problems please try again later." }
                    }
                    messageFactory.sendMessage(senderID, reply);
                });
            } else if (data.read) {
                //console.log("read");
            } else if (data.delivery) {
                //console.log("delivered");
            } else if (account_linking && (account_linking.authorization_code === linkingSecret)) {
                //console.log("authorised linking callback: " + account_linking.status);
            } else if (account_linking && !account_linking.authorization_code) {
                //console.log("linking callback: " + account_linking.status);
            } else if (account_linking) {
                console.error("WARNING unauthorized!!!!");
            } else if (data.postback && data.postback.payload === "get started") {
                messageFactory.sendMessage(senderID, buttons("first"));
            } else {
                console.log("you what?");
                console.log(data);
            }
        })
    });


    res.sendStatus(200); //required to send for each batch else all fails.
})

router.get('/', function(req, res) {
    if (req.query['hub.verify_token'] === webhookSecret) {
        console.log("verified");
        res.send(req.query['hub.challenge']);
    } else { res.send('Wrong token bud') }
});

module.exports = router
