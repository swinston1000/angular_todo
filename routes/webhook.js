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
    var read = data.read;
    var delivery = data.delivery
    var account_linking = data.account_linking
    var senderID = data.sender.id;

    console.log("incoming...")

    if (message) {
        console.log(message);
        message = message.text;
        var reply = buildReply(senderID, message);
        sendMessage(senderID, reply);
    } else if (read) {
        console.log("read");
    } else if (delivery) {
        console.log("delivered");
    } else if (account_linking && (account_linking.authorization_code === linkingSecret)) {
        console.log("authorised linking callback: " + account_linking.status);
    } else if (account_linking && !account_linking.authorization_code) {
        console.log("linking callback: " + account_linking.status);
    } else if (account_linking) {
        console.log("warning unauthorized");
    } else {
        console.log("you what?");
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
                        "url": "https://www.evernote.com/OAuth.action?oauth_token=yarivadam.15903DEE8AC.68747470733A2F2F6D3433693664633665652E657865637574652D6170692E75732D656173742D312E616D617A6F6E6177732E636F6D2F446576.214B4FD6DB33D4FE9D6B99D320C7D3DA&h=yAQGYMbXl",
                        //"url":'https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.evernote.com%2FOAuth.action%3Foauth_token%3Dyarivadam.15903DEE8AC.68747470733A2F2F6D3433693664633665652E657865637574652D6170692E75732D656173742D312E616D617A6F6E6177732E636F6D2F446576.214B4FD6DB33D4FE9D6B99D320C7D3DA&h=yAQGYMbXl'
                        //"url": "https://todoosey.herokuapp.com/webhook/authorization"
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

    if (message === "login") {
        return loginButton
    } else if (message === "logout") {
        return logoutButton
    } else if (message === "add") {

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

router.get('/authorization', function(req, res) {
    //console.log('req');
    //console.log(req);
    var redirect_uri = req.query['redirect_uri'];
    var account_linking_token = req.query['account_linking_token'];
    console.log(redirect_uri);

    request({
        uri: 'https://graph.facebook.com/v2.6/me',
        qs: {
            access_token: facebookAccessID,
            fields: "recipient",
            account_linking_token: account_linking_token
        },
        method: 'GET',
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var id = JSON.parse(body).id;
            console.log("redirecting");
            res.redirect('https://l.facebook.com/l.php?u=https://todoosey.herokuapp.com/authorize?redirect=' + redirect_uri + '&psid=' + id + '&auth=' + linkingSecret)

        } else {
            console.error("Error Authorizing!!!!");
            console.error(response.statusMessage);
            console.error(response.statusCode);
            res.redirect(redirect_uri)
        }
    });
});

module.exports = router
