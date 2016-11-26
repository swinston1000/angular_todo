var express = require('express')
var app = express()
app.use(express.static(__dirname))


var path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('*', function(req, res) {
    res.redirect("/")
})

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})
