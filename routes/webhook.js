var request = require('request');
var express = require('express');
var router = express.Router();
var facebookAccessID = process.env.FACEBOOK_ID || require('../auth0-secret').facebookAccessID
var webhookSecret = process.env.WEBHOOK_SECRET || require('../auth0-secret').webhookSecret
var linkingSecret = process.env.LINKING_SECRET || require('../auth0-secret').linkingSecret


router.get('/', function(req, res) {
    if (req.query['hub.verify_token'] === webhookSecret) {
        res.send(req.query['hub.challenge']);
    } else { res.send('Wrong token bud') }
});

router.get('/authorize', function(req, res) {

    var redirect_uri = req.query['redirect_uri'];
    var account_linking_token = req.query['account_linking_token'];

    //"https://graph.facebook.com/v2.6/me?access_token=PAGE_ACCESS_TOKEN&fields=recipient&account_linking_token=ACCOUNT_LINKING_TOKEN"

    console.log("-------------");
    //console.log(req);
    console.log("-------------");


    //console.log(localStorage.getItem('to_do_profile'));

    var authorization_code = linkingSecret;
    var uri = redirect_uri + "&authorization_code=" + linkingSecret

    console.log("request to authorize: " + uri);

    res.redirect(uri)
});

router.post('/', function(req, res) {

    var data = req.body.entry[0].messaging[0];
    var message = data.message;
    var read = data.read;
    var delivery = data.delivery
    var account_linking = data.account_linking
    var senderID = data.sender.id;

    if (message) {
        //console.log(data);
        message = message.text;
        var reply = getReplyBasedOnMessage(message);
        sendMessage(senderID, reply);
    } else if (read) {
        console.log("read");
    } else if (delivery) {
        console.log("delivered");
    } else if (account_linking) {
        console.log("linking callback");
        console.log(data.account_linking);
    } else {
        console.log("you what?");
        //console.log(data);
    }

    res.sendStatus(200); //required to send FB some response, else all fails.
});

function getReplyBasedOnMessage(message) {
    //At this point, you work some logical magic here
    //It could be a series of if-else statements, or something more intricate
    //For now, we'll just reply with something simple:

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
                        "url": "https://todoosey.herokuapp.com/webhook/authorize"
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
                    "title": "Goodbye?",
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

module.exports = router
