var rp = require('request-promise');
var request = require('request');

var express = require('express');
var router = express.Router();
var facebookAccessID = process.env.FACEBOOK_ID || require('../auth0-secret').facebookAccessID
var webhookSecret = process.env.WEBHOOK_SECRET || require('../auth0-secret').webhookSecret
var linkingSecret = process.env.LINKING_SECRET || require('../auth0-secret').linkingSecret
var auth0api = process.env.AUTH0_API || require('../auth0-secret').auth0api;

router.post('/', function(req, res) {

    var data = req.body.entry[0].messaging[0];
    var message = data.message;
    var account_linking = data.account_linking
    var senderID = data.sender.id;

    console.log("incoming...")

    if (message) {
        console.log(message);
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
        console.log("warning unauthorized");
    } else if (data.postback) {
        console.log(data.postback);
    } else {
        console.log("you what?");
        console.log(req.body);
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
    return rp({
        url: 'https://app60017704.eu.auth0.com/api/v2/users',
        headers: {
            Authorization: 'Bearer ' + auth0api
        },
        qs: {
            search_engine: 'v2',
            q: 'psid:"' + psid + '"',
        }
    });
}

function buildReply(senderID, message) {

    console.log("building reply");

    var loginButton = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Welcome to Todoosey",
                    "image_url": "https://cdn2.iconfinder.com/data/icons/productivity-at-work/256/To-Do_List-512.png",
                    "buttons": [{
                        "type": "account_link",
                        "url": "https://todoosey.herokuapp.com/authorize?signup=false",
                    }]
                }]
            }
        }
    }

    var logoutButton = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Time to say goodbye?",
                    "image_url": "https://cdn2.iconfinder.com/data/icons/productivity-at-work/256/To-Do_List-512.png",
                    "buttons": [{
                        "type": "account_unlink"
                    }]
                }]
            }
        }
    }

    if (message.toLowerCase() === "login") {
        return loginButton
    } else if (message.toLowerCase() === "logout") {
        return logoutButton
    } else if (message.toLowerCase() === "add") {

        console.log("adding");

        getUserFromDB(senderID).then(function(response) {
            console.log(response);
            return { text: 'Cool, what do you need to do?' }
        }, function(error) {
            console.log("error");
            console.log(error);
            return { text: 'Sorry we had an error!' }
        })

    } else {
        return { text: "Hey, I think it's cool that you said '" + message + "'" }
    }
}

function sendMessage(recipientId, message) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: message
    };
    callSendAPI(messageData);
}

function callSendAPI(messageData) {
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

(function setupGreeting() {

    var gettingStartedButton = {
        "setting_type": "call_to_actions",
        "thread_state": "new_thread",
        "call_to_actions": [{
            "payload": "GET STARTED"
        }]
    }
    var firstGreeting = {
        "setting_type": "greeting",
        "greeting": {
            "text": "Hi {{user_first_name}}, welcome to Todoosey."
        }
    }
    request({
        uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
        qs: { access_token: facebookAccessID },
        method: 'POST',
        json: gettingStartedButton,
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Successfully sent message");
            console.log(body);
        } else {
            console.error("Unable to send message.");
            console.error(response.statusMessage);
            console.error(response.statusCode);
            console.error(error);
        }
    });
})()

module.exports = router
