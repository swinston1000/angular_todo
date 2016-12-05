var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
var filter = require('content-filter')

app.use(cors()); //needed???
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var blackList = ['$', '{', '&&', '||']
var options = {
    urlBlackList: blackList,
    bodyBlackList: blackList
}

app.use(filter(options));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var todos = require('./routes/todos')(io);

app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
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
        res.end('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.end('error', {
        message: err.message,
        error: {}
    });
});
