var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var jwt = require('express-jwt');
var filter = require('content-filter')
var auth0clientSecret = process.env.AUTH0_CLIENT_SECRET || require('./auth0-secret').clientSecret
var app = express()

app.use(cors()); //needed???
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var blackList = ['$', '{', '&&', '||']
var options = {
    urlBlackList: blackList,
    bodyBlackList: blackList
}

var jwtCheck = jwt({
    secret: new Buffer(auth0clientSecret, 'base64'),
    audience: 'F3kTtFLJVyWUqdcqoW0eWHn7dH9rmOtJ'
});

app.use(filter(options));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var todos = require('./routes/todos')(io);

app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use('/todos', jwtCheck);
app.use('/todos', todos);

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
