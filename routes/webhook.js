var rp = require('request-promise');
var request = require('request');

var express = require('express');
var router = express.Router();
var facebookAccessID = process.env.FACEBOOK_ID || require('../auth0-secret').facebookAccessID
var webhookSecret = process.env.WEBHOOK_SECRET || require('../auth0-secret').webhookSecret
var linkingSecret = process.env.LINKING_SECRET || require('../auth0-secret').linkingSecret
var auth0api = process.env.AUTH0_API || require('../auth0-secret').auth0api;

buttons = require("./messengerbuttons")

router.post('/', function(req, res) {

    var data = req.body.entry[0].messaging[0];
    var message = data.message;
    var account_linking = data.account_linking
    var senderID = data.sender.id;

    if (message) {
        message = message.text;
        var reply = buildReply(senderID, message);
        sendMessage(senderID, reply);
    } else if (data.read) {
        console.log("read");
    } else if (data.delivery) {
        console.log("delivered");
    } else if (account_linking && (account_linking.authorization_code === linkingSecret)) {
        console.log("authorised linking callback: " + account_linking.status);
    } else if (account_linking && !account_linking.authorization_code) {
        console.log("linking callback: " + account_linking.status);
    } else if (account_linking) {
        console.error("warning unauthorized!!!!");
    } else if (data.postback && data.postback.payload === "get started") {
        sendMessage(senderID, buttons("first"));
    } else {
        console.log("you what?");
        console.log(data);
    }
    res.sendStatus(200); //required to send FB some response, else all fails.
});


router.get('/', function(req, res) {
    console.log("hello you tried to get to /webhook");
    if (req.query['hub.verify_token'] === webhookSecret) {
        console.log("verified");
        res.send(req.query['hub.challenge']);
    } else { res.send('Wrong token bud') }
});


function getUserFromDB(psid) {
    request({
        url: 'https://app60017704.eu.auth0.com/api/v2/users',
        headers: {
            Authorization: 'Bearer ' + auth0api
        },
        qs: {
            search_engine: 'v2',
            q: 'psid:"' + psid + '"',
        }
    }, function(error, response, body) {
        if (error) {
            console.error(error);
            return { text: 'Sorry we had an error!' }
        } else {
            console.log(body);
            return { text: 'Cool, what do you need to do?' }
        }
    })
}

function buildReply(senderID, message) {

    console.log("building reply");

    if (message.toLowerCase() === "login") {
        return buttons("login")
    } else if (message.toLowerCase() === "logout") {
        return buttons("logout")
    } else if (message.toLowerCase() === "signup") {
        return buttons("signup")
    } else if (message.toLowerCase() === "add") {
        return getUserFromDB(senderID)
    } else {
        return { text: "Hey, I think it's cool that you said '" + message + "'" }
    }
}

function sendMessage(recipientId, message) {
    console.log(message);
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: message
    };
    callSendAPI(messageData);
}

function callSendAPI(messageData) {
    //console.log(messageData);
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: facebookAccessID },
        method: 'POST',
        json: messageData
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Successfully sent message");
        } else {
            console.error("Unable to send message.");
            console.error(response.statusMessage);
            console.error(response.statusCode);
            console.error(error);
        }
    });
}

// (function setupGreeting() {
//     var gettingStartedButton = {
//         "setting_type": "call_to_actions",
//         "thread_state": "new_thread",
//         "call_to_actions": [{
//             "payload": "get started"
//         }]
//     }
//     var firstGreeting = {
//         "setting_type": "greeting",
//         "greeting": {
//             "text": "Hi {{user_first_name}}, welcome to Todoosey. Click below to start."
//         }
//     }
//     request({
//         uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
//         qs: { access_token: facebookAccessID },
//         method: 'POST',
//         json: gettingStartedButton,
//     }, function(error, response, body) {
//         if (!error && response.statusCode == 200) {
//             console.log("Successfully sent message");
//             console.log(body);
//         } else {
//             console.error("Unable to send message.");
//             console.error(response.statusMessage);
//             console.error(response.statusCode);
//             console.error(error);
//         }
//     });
// })();

module.exports = router
