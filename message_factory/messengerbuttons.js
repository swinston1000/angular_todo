module.exports = function(type, options) {

    var title = "Welcome to Todoosey";
    var buttonType = "account_link";
    var url = "https://todoosey.herokuapp.com/authorize"

    if (type = "quick") {

        replyArray = []

        options.buttons.forEach(function(button) {
            replyArray.push({
                "content_type": "text",
                "title": button,
                "payload": options.payload
            })
        })

        return {
            "text": options.text,
            "quick_replies": replyArray
        }

    } else if (type === "signup") {
        url = url + "?login=false";
    } else if (type === "login") {
        title = "Login to Todoosey";
        url = url + "?login=true";
    } else if (type === "logout") {
        title = "Time to say goodbye?";
        buttonType = "account_unlink";
        url = ""
    }

    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": title,
                    "image_url": "https://cdn2.iconfinder.com/data/icons/productivity-at-work/256/To-Do_List-512.png",
                    "buttons": [{
                        "type": buttonType,
                        "url": url,
                    }]
                }]
            }
        }
    }
}
