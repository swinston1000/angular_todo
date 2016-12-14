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
    //console.log(senderID);

    if (message) {
        message = message.text;
        var reply = replyBasedOnMessage(message);
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
    if (req.query['hub.verify_token'] === webhookSecret) {
        res.send(req.query['hub.challenge']);
    } else { res.send('Wrong token bud') }
});

// router.get('/authorize', function(req, res) {
//     //console.log('req');
//     //console.log(req);
//     var redirect_uri = req.query['redirect_uri'];
//     var account_linking_token = req.query['account_linking_token'];
//     res.redirect('?redirect_uri=' + redirect_uri + '&account_linking_token=' + linkingSecret)

//     request({
//         uri: 'https://graph.facebook.com/v2.6/me',
//         qs: {
//             access_token: facebookAccessID,
//             fields: "recipient",
//             account_linking_token: account_linking_token
//         },
//         method: 'GET',
//     }, function(error, response, body) {
//         if (!error && response.statusCode == 200) {
//             console.log("Success ID: ");
//             console.log(body)

//             request({
//                     url: 'https://app60017704.eu.auth0.com/api/v2/users',
//                     headers: {
//                         Authorization: 'Bearer ' + auth0api
//                     },
//                     qs: {
//                         search_engine: 'v2',
//                         q: 'identities.connection:"facebook"',
//                     }
//                 },
//                 function(err, respo, bday) {
//                     if (err) {
//                         console.log(err);
//                     } else if (respo.statusCode !== 200) {
//                         console.log(respo.statusMessage);
//                     } else {
//                         //var data = JSON.parse(bday);
//                         //console.log(data);
//                         res.redirect(redirect_uri + "&authorization_code=" + linkingSecret)
//                     }
//                 });

//         } else {
//             console.error("Error Authorizing!!!!");
//             console.error(response.statusMessage);
//             console.error(response.statusCode);
//             res.redirect(redirect_uri)
//         }
//     });
// });



function replyBasedOnMessage(message) {
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
                        "url": "https://todoosey.herokuapp.com/authorize"
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
