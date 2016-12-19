var express = require('express');
var router = express.Router();
var webhookSecret = process.env.WEBHOOK_SECRET || require('../auth0-secret').webhookSecret
var linkingSecret = process.env.LINKING_SECRET || require('../auth0-secret').linkingSecret

var buttons = require("../message_factory/messengerbuttons")
var messageFactory = require("../message_factory/factory")

router.post('/', function(req, res) {

    console.log(JSON.stringify(req.body.entry));

    req.body.entry.forEach(function(entry) {
        entry.messaging.forEach(function(data) {

            var message = data.message;
            var account_linking = data.account_linking
            var senderID = data.sender.id;

            if (message) {
                console.log("message");
                console.log(message);
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
