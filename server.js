var express = require('express')
var bodyParser = require('body-parser')
var jwt = require('express-jwt');
var filter = require('content-filter')
var request = require('request');


//var pug = require('pug');
var auth0clientSecret = process.env.AUTH0_CLIENT_SECRET || require('./auth0-secret').clientSecret
var linkingSecret = process.env.LINKING_SECRET || require('./auth0-secret').linkingSecret
var facebookAccessID = process.env.FACEBOOK_ID || require('./auth0-secret').facebookAccessID

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var jwtCheck = jwt({
    secret: new Buffer(auth0clientSecret, 'base64'),
    audience: 'F3kTtFLJVyWUqdcqoW0eWHn7dH9rmOtJ'
});

app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));

var webhook = require('./routes/webhook')
app.use('/webhook', webhook);

//try to prevent injection attacks
// var blackList = ['$', '{', '&&', '||']
// var options = {
//     urlBlackList: blackList,
//     bodyBlackList: blackList,
//     urlMessage: 'A forbidden expression has been found in URL: ',
//     bodyMessage: 'A forbidden expression has been found in form data: '
// }
// app.use(filter(options));

var todos = require('./routes/todos')(io);
app.use('/todos', jwtCheck);
app.use('/todos', todos);

app.set('view engine', 'pug')

app.get("/authorize", function(req, res) {

    var redirect_uri = req.query['redirect_uri'];
    var account_linking_token = req.query['account_linking_token'];
    var login = true;
    var signup = true;
    if (req.query.login) {
        login = req.query.login === "true" ? true : false;
        signup = !login
    }

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
            var id = JSON.parse(body).recipient;
            var config = { redirect: redirect_uri, auth: linkingSecret, psid: id, login: login, signup: signup }
            res.render('auth0', { config: JSON.stringify(config) });
        } else {
            console.error("Error Authorizing!!!!");
            console.error(response.statusMessage);
            console.error(response.statusCode);
            res.redirect(redirect_uri)
        }
    });
})

//see https://github.com/angular-ui/ui-router/issues/372
app.get("*", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
})

server.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening on port 3000!')
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.end(err.message, {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.end(err.message, {
        message: err.message,
        error: {}
    });
});
