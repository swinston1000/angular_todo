var express = require('express');
var router = express.Router();
var db = require('../models/model.js');

var webhookSecret = process.env.WEBHOOK_SECRET || require('../auth0-secret').webhookSecret
var linkingSecret = process.env.LINKING_SECRET || require('../auth0-secret').linkingSecret

var buttons = require("../message_factory/messengerbuttons")
var messageFactory = require("../message_factory/factory")
var authenticate = require("../message_factory/authenticate")

var cache = {}

router.post('/', function(req, res) {

    req.body.entry.forEach(function(entry) {
        entry.messaging.forEach(function(data) {

            var message = data.message;
            var senderID = data.sender.id;

            if (message && message.is_echo && message.metadata) {
                cache[data.recipient.id] = {};
                cache[data.recipient.id].email = message.metadata;
                cache[data.recipient.id].status = 1
                console.log(message.metadata);

            } else if (message && message.is_echo) {
                //maybe in future we can log these messages
            } else if (data.postback && data.postback.payload === "ADD_TODO") {
                console.log("why are we here???");
                var text;
                authenticate(senderID, function(error, response) {
                    if (error) {
                        text = "Sorry we are having problems please try again later.";
                    } else if (!response) {
                        text = "Please type 'login' or 'signup' to use this feature!";
                    } else {
                        text = "What do do you need to do?";
                    }
                    messageFactory.sendMessage(senderID, { metadata: response, text: text })
                })

            } else if (message && message.quick_reply && message.quick_reply.payload === "PRIORITY") {
                cache[senderID].status = 3
                cache[senderID].priority = message.text
                var options = {
                    text: "What is the task category?",
                    payload: "TASK",
                    buttons: ["Work", "Personal", "Other"]
                }
                messageFactory.sendMessage(senderID, buttons("quick", options))

            } else if (message && cache[senderID] && cache[senderID].status === 3) {

                cache[senderID].category = message.text
                cache[senderID].completed = false
                delete cache[senderID].status

                db.users.findUserAndAddTodo(cache[senderID].email, cache[senderID], function(err, data) {
                    if (err) {
                        console.error(err);
                        messageFactory.sendMessage(senderID, { text: "There was an error adding your item!" })
                    } else {
                        console.log(data);
                        messageFactory.sendMessage(senderID, { text: "Thanks your to do has been added" })
                        cache[senderID] = null;
                    }
                })

            } else if (message && cache[senderID] && cache[senderID].status === 1) {
                cache[senderID].task = message.text
                cache[senderID].status = 2
                var options = {
                    text: "What is the priority from 1 to 5? (1 being the most urgent)",
                    payload: 'PRIORITY',
                    buttons: ["1", "2", "3", "4", "5"]
                }
                messageFactory.sendMessage(senderID, buttons("quick", options))

            } else if (message && cache[senderID] && cache[senderID].status === 2) {
                var options = {
                    text: "Please click a button to choose the priority from 1 to 5? (1 being the most urgent)",
                    payload: 'PRIORITY',
                    buttons: ["1", "2", "3", "4", "5"]
                }
                messageFactory.sendMessage(senderID, buttons("quick", options))

            } else if (message) {
                messageFactory.buildReply(senderID, message.text, function(err, reply) {
                    if (err) {
                        console.error(err);
                        reply = { text: "Sorry we are having problems please try again later." }
                    }
                    messageFactory.sendMessage(senderID, reply);
                });

            } else if (data.account_linking && data.account_linking.authorization_code && (data.account_linking.authorization_code != linkingSecret)) {
                console.error("WARNING unauthorized access!!!!");

            } else if (data.postback && data.postback.payload === "get started") {
                messageFactory.sendMessage(senderID, buttons("first"));

            } else {
                console.log("What?!?!?");
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
