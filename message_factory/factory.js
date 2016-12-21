var request = require('request');
var authenticate = require("./authenticate")
var buttons = require("./messengerbuttons")

var facebookAccessID = process.env.FACEBOOK_ID || require('../auth0-secret').facebookAccessID

var buildReply = function(senderID, message, cb) {

    if (message.toLowerCase() === "login") {
        return cb(null, buttons("login"))
    } else if (message.toLowerCase() === "signup") {
        return cb(null, buttons("signup"))
    }
    authenticate(senderID, function(error, response) {
        if (error) {
            return cb(error)
        } else if (!response) {
            return cb(null, { text: "Please type 'login' or 'signup' to use this feature!" })
        } else if (message.toLowerCase() === "logout") {
            return cb(null, buttons("logout"))
        } else if (message.toLowerCase() === "add") {
            return cb(null, { text: "What do do you need to do?", metadata: response })
        } else {
            return cb(null, { text: "Sorry I do not recognize that command. Type 'add' to make a new ToDo!" })
        }
    })
}

var sendMessage = function(recipientId, message) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: message
    };
    _callSendAPI(messageData);
}

function _callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: facebookAccessID },
        method: 'POST',
        json: messageData
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log("Successfully sent message");
        } else {
            console.error("Unable to send message.");
            console.log(messageData);
            console.error(response.statusMessage);
            console.error(response.statusCode);
            console.error(error);
        }
    });
}

module.exports = {
    sendMessage: sendMessage,
    buildReply: buildReply
}


// function setupThread() {
//     var gettingStartedButton = {
//         "setting_type": "call_to_actions",
//         "thread_state": "new_thread",
//         "call_to_actions": [{
//             "payload": "get started"
//         }]
//     };
//     var firstGreeting = {
//         "setting_type": "greeting",
//         "greeting": {
//             "text": "Hi {{user_first_name}}, welcome to Todoosey. Click below to start."
//         }
//     };
//     var persistantMenu = {
//         "setting_type": "call_to_actions",
//         "thread_state": "existing_thread",
//         "call_to_actions": [{
//             "type": "postback",
//             "title": "Add ToDo",
//             "payload": "ADD_TODO"
//         }, {
//             "type": "web_url",
//             "title": "View Website",
//             "url": "http://todoosey.herokuapp.com/",
//             "webview_height_ratio": "full",
//         }]
//     };
//     request({
//         uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
//         qs: { access_token: facebookAccessID },
//         method: 'POST',
//         json: persistantMenu,
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
// };
// setupThread();
